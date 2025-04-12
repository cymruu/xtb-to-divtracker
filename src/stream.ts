import { parseCostPerShare } from "./parsers/parseCostPerShare";
import { parseDate } from "./parsers/parseDate";
import { parseQuantity } from "./parsers/parseQuantity";
import { parseTicker } from "./parsers/parseTicker";

const textEncoder = new TextEncoder();

const INPUT_FILE_HEADER = ["ID", "Type", "Time", "Comment", "Symbol", "Amount"];

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

export const processRowStream = async (
  readableStream: ReadableStream<string[]>,
  currency: string,
) => {
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

  await readableStream
    .pipeThrough(mapToObject())
    .pipeThrough(filterData())
    .pipeThrough(parseData(currency))
    .pipeThrough(serializeToCSV())
    .pipeThrough(serializeToBytes())
    .pipeTo(outputStream);

  const timeStamp = new Date().toISOString();
  const fileName = `wallet_${currency}_${timeStamp}.csv`;

  const resultFile = new File(chunks, fileName);

  return resultFile;
};

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
        lineType === "Stocks/ETF sale" ||
        // 2025-04-12 XTB introduced a bug where `Type` column contained internal type names
        lineType === "Stock sale" ||
        lineType === "Stock purchase"
      ) {
        controller.enqueue(chunk);
      }
    },
  });

const parseData = (currency: string) =>
  new TransformStream({
    transform(chunk, controller) {
      controller.enqueue({
        Ticker: parseTicker(chunk["Symbol"]),
        Quantity: parseQuantity(chunk["Comment"]),
        CostPerShare: parseCostPerShare(chunk["Comment"]),
        Currency: currency,
        Date: parseDate(chunk["Time"]),
        Commission: "",
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
