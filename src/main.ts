import { parseCostPerShare } from "./parsers/parseCostPerShare";
import { parseDate } from "./parsers/parseDate";
import { parseQuantity } from "./parsers/parseQuantity";

const textEncoder = new TextEncoder();

const INPUT_FILE_HEADER = ["ID", "Type", "Time", "Symbol", "Comment", "Amount"];
const OUTPUT_FILE_HEADER = [
  "Ticker",
  "Quantity",
  "Cost Per Share",
  "Currency",
  "Date",
  "Commission",
  "Commission Currency",
  "DRIP Confirmed",
];

const createCSVLine = (values: string[]) => {
  return values.join(";") + "\n";
};

const processFile = async (file: File, currency: string) => {
  const chunks: string[] = [];

  const outputStream = new WritableStream({
    write(chunk) {
      chunks.push(chunk);
    },
  });

  const writer = outputStream.getWriter();
  const headerBytes = textEncoder.encode(createCSVLine(OUTPUT_FILE_HEADER));

  await writer.write(headerBytes);
  writer.releaseLock();

  await file
    .stream()
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(unwrapCSVLinesTransform())
    .pipeThrough(parseCSVRow())
    .pipeThrough(mapToObject())
    .pipeThrough(filterData())
    .pipeThrough(parseData(currency))
    .pipeThrough(serializeToCSV())
    .pipeThrough(serializeToBytes())
    .pipeTo(outputStream);

  const timeStamp = new Date().toISOString();
  const fileName = `wallet_${currency}_${timeStamp}.csv`;

  const resultFile = new File(chunks, fileName);

  const link = downloadFile(resultFile, resultFile.name);
  link.click();
};

const unwrapCSVLinesTransform = () =>
  new TransformStream({
    transform(chunk, controller) {
      const lines = chunk.split("\r\n");
      for (const line of lines) {
        controller.enqueue(line);
      }
    },
  });

const parseCSVRow = () =>
  new TransformStream({
    transform(chunk, controller) {
      const values = chunk.split(";");
      controller.enqueue(values);
    },
  });

const mapToObject = () =>
  new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(
        Object.fromEntries(
          INPUT_FILE_HEADER!.map((key, index) => [key, chunk[index]]),
        ),
      );
    },
  });

const filterData = () =>
  new TransformStream({
    transform(chunk, controller) {
      const lineType = chunk["Type"];
      if (
        lineType === "Stocks/ETF purchase" ||
        lineType === "Stocks/ETF sale"
      ) {
        controller.enqueue(chunk);
      }
    },
  });

const parseData = (currency: string) =>
  new TransformStream({
    transform(chunk, controller) {
      controller.enqueue({
        Ticker: chunk["Symbol"],
        Quantity: parseQuantity(chunk["Comment"]),
        CostPerShare: parseCostPerShare(chunk["Comment"]),
        Currency: currency,
        Date: parseDate(chunk["Time"]),
        Commision: "",
        CommissionCurrency: "",
        DRIPConfirmed: "",
      });
    },
  });

const serializeToCSV = () =>
  new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(
        createCSVLine([
          chunk.Ticker,
          chunk.Quantity,
          chunk.CostPerShare,
          chunk.Currency,
          chunk.Date,
          chunk.Commission,
          chunk.CommissionCurrency,
          chunk.DRIPConfirmed,
        ]),
      );
    },
  });

const serializeToBytes = () =>
  new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(textEncoder.encode(chunk));
    },
  });

const downloadFile = (file: File, filename: string): HTMLAnchorElement => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = filename;

  return link;
};

(() => {
  const dropArea = document.getElementById("drop-area")!;
  const fileContentDiv = document.getElementById("file-content")!;

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.style.borderColor = "#333";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#ccc";
  });

  dropArea.addEventListener("drop", async (event) => {
    const currency = (<HTMLSelectElement>document.getElementById("currency"))
      .value;
    event.preventDefault();
    dropArea.style.borderColor = "#ccc";

    const file = event.dataTransfer?.files[0];

    if (file && file.type === "text/csv") {
      processFile(file, currency);
    } else {
      fileContentDiv.textContent = "Please upload a valid CSV file.";
    }
  });
})();
