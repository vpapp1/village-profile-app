// @ts-ignore - Dexie types are defined but package.json exports configuration issue
import Dexie from "dexie";
import { IBasti } from "./models/BastiModel";
import { ISabikWard } from "./models/SabikWardModel";
import { ICountry } from "./models/CountryModel";
import { ICountrySamuha } from "./models/CountrySamuhaModel";
import { IDistrict } from "./models/DistrictModel";
import { IDharma } from "./models/DharmaModel";
import { IHousehold } from "./models/Household";
import { IJaati } from "./models/JaatiModel";
import { IJaatiSamuha } from "./models/JaatiSamuhaModel";
import { IMarga } from "./models/MargaModel";
import { IMember } from "./models/Member";
import { IMotherTongue } from "./models/MotherTongue";
import { IOccupation } from "./models/Occupation";
import { IEducationStage } from "./models/EducationStage";
import { IProfessionCategory } from "./models/ProfessionCategory";
import { IProfession } from "./models/Profession";
import { ITechnicalSkill } from "./models/TechnicalSkill";
import { IRelationWithHoh } from "./models/RelationWithHohModel";
import { IVehicleType } from "./models/VehicleType";
import { IUser } from "./models/UserModel";
import { IWard } from "./models/WardModel";

export class AppDatabase extends Dexie {
  users: Dexie.Table<IUser>;
  wards: Dexie.Table<IWard>;
  sabikWards: Dexie.Table<ISabikWard>;
  bastis: Dexie.Table<IBasti>;
  margas: Dexie.Table<IMarga>;
  jaatis: Dexie.Table<IJaati>;
  districts: Dexie.Table<IDistrict>;
  countries: Dexie.Table<ICountry>;
  country_samuhas: Dexie.Table<ICountrySamuha>;
  mother_toungues: Dexie.Table<IMotherTongue>;
  jaati_samuhas: Dexie.Table<IJaatiSamuha>;
  dharmas: Dexie.Table<IDharma>;
  occupations: Dexie.Table<IOccupation>;
  educationStages: Dexie.Table<IEducationStage>;
  professionCategories: Dexie.Table<IProfessionCategory>;
  professions: Dexie.Table<IProfession>;
  relationWithHohs: Dexie.Table<IRelationWithHoh>;
  households: Dexie.Table<IHousehold>;
  members: Dexie.Table<IMember>;
  technicalSkills: Dexie.Table<ITechnicalSkill>;
  vehicleTypes: Dexie.Table<IVehicleType>;

  constructor() {
    super("VPDB");

    var db = this;
    (db as any).version(205).stores({
      users: "++id, name, username, phone, password, office_id, office_name",
      wards: "id, name, status",
      sabikWards: "id, name, status, wardId",
      bastis: "id, name, status, wardId,sabikWardId",
      margas: "id, name, status, wardId, sabikWardId, bastiId",
      jaatis: "id, name, status, jaati_samuha_id",
      districts: "id, name, status",
      jaati_samuhas: "id, name, status",
      countries: "id, name, jaati_samuha_id",
      country_samuhas: "id, name",
      mother_toungues: "id, name, status",
      dharmas: "id, name, status",
      occupations: "id, name, status",
      educationStages: "id, name",
      professionCategories: "id, name, weight",
      professions: "id, name, category_id",
      relationWithHohs: "id, name, status, order, gender_id",
      technicalSkills: "id, name, status",
      vehicleTypes: "id, name, status",
      households:
        "++id, name, phone, password, is_posted, is_complete, is_deleted, [is_posted+is_complete+is_deleted]",
      members: "++id, name, hh_id",
    });
    (db as any).open()
      .then(async function (db: any) {
        console.log("DB opened Succefully");
        console.log("React Server:", process.env.REACT_APP_SERVER);
        db.tables.forEach(function (table: any) {
          console.log(table.name);
        });
      })
      .catch(function (err: any) {
        console.log("DB error", err);
      });
  }
}
export var db = new AppDatabase();
