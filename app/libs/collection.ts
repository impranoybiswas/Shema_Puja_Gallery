import { getCollection } from "@/app/libs/connectDB";

export async function getItemsCollection() {
  const collection = await getCollection("products");
  if (!collection) {
    throw new Error("Failed to connect to collection");
  }
  return collection;
}

export async function getUsersCollection() {
  const collection = await getCollection("users");
  if (!collection) {
    throw new Error("Failed to connect to collection");
  }
  return collection;
}
