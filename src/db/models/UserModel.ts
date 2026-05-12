import { db } from "../db";

export interface IUser {
  id?: number;
  name: string;
  username: string;
  office_name: string;
  office_id: string;
  phone: string;
  password: string;
}
export class User {
  id: number;
  name: string;
  username: string;
  phone: string;
  password: string;
  office_name: string;
  office_id: string;

  constructor(data: IUser) {
    this.name = data.name;
    this.username = data.username;
    this.phone = data.phone;
    this.password = data.password;
    this.office_name = data.office_name;
    this.office_id = data.office_id;
    if (data.id) this.id = data.id;
    db.users.mapToClass(User);
  }
  save() {
    return db.users.put(this);
  }
}

export async function addNewUser(data: IUser) {
  // Merge with any existing user record so we don't lose locally-entered fields
  const existing = await db.users.toArray();
  const existingUser = existing && existing.length ? existing[0] : null;
  const merged: any = { ...(existingUser || {}), ...(data || {}) };

  // If an existing record has an id, preserve it and use put (update), otherwise add a new record
  if (existingUser && existingUser.id) {
    merged.id = existingUser.id;
    await db.users.put(merged);
    console.log("updated user", merged);
  } else {
    const id = await db.users.add(merged);
    console.log("added user", id, merged);
  }
}

export async function getAllUsers() {
  const users = await db.users.toArray();
  return users;
}

export async function getUserById(id: string) {
  return await db.users.get(id);
}

export async function updateUser(data: IUser) {
  return await db.users.put({...data});
}

export async function deleteUser() {
  return await db.users.clear();
}
