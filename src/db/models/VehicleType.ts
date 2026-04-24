import { db } from "../db";

export interface IVehicleType {
  id?: number;
  name: string;
  status: number;
}

export class VehicleType {
  id: number;
  name: string;
  status: number;

  constructor(data: IVehicleType) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.vehicleTypes.mapToClass(VehicleType);
  }
  save() {
    return db.vehicleTypes.put(this);
  }
}

export async function addNewVehicleType(data: IVehicleType) {
  await db.transaction("rw", db.vehicleTypes, async function () {
    await db.vehicleTypes.add(new VehicleType({ ...data }));
  });
}

export async function getAllVehicleTypes() {
  return await db.transaction("r", db.vehicleTypes, async function () {
    let vehicleTypes = await db.vehicleTypes.toArray();
    return vehicleTypes;
  });
}

export async function getVehicleTypeById(id: string) {
  return await db.vehicleTypes.get(id);
}

export async function getVehicleTypeByName(name: string) {
  return await db.vehicleTypes.where("name").startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateVehicleType(data: IVehicleType) {
  return await db.vehicleTypes.put({ ...data });
}
