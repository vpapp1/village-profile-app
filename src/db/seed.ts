import api from "../Api/api";
import { db } from "./db";
import { updateBasti } from "./models/BastiModel";
import { addNewSabikWard, getSabikWardByName } from "./models/SabikWardModel";
import { addNewCountry, getCountryByName } from "./models/CountryModel";
import { addNewCountrySamuha, getCountrySamuhaByName } from "./models/CountrySamuhaModel";
import { upsertDistrict } from "./models/DistrictModel";
import { addNewDharma, getDharmaByName } from "./models/DharmaModel";
import { addNewHousehold, getAllHousehold, IHousehold, updateHousehold } from "./models/Household";
import { addNewJaati, getJaatiByName } from "./models/JaatiModel";
import { addNewJaatiSamuha, getJaatiSamuhaByName } from "./models/JaatiSamuhaModel";
import { updateMarga } from "./models/MargaModel";
import { IMember } from "./models/Member";
import { addNewMotherToungue, getMotherToungueByName } from "./models/MotherTongue";
import { addNewOccupation, getOccupationByName } from "./models/Occupation";
import { addNewEducationStage, getEducationStageByName } from "./models/EducationStage";
import { addNewProfessionCategory, getProfessionCategoryByName } from "./models/ProfessionCategory";
import { addNewProfession, getProfessionByName } from "./models/Profession";
import { addNewRelationWithHoh, getRelationWithHohByName } from "./models/RelationWithHohModel";
import { addNewTechnicalSkill, getTechnicalSkillByName } from "./models/TechnicalSkill";
import { addNewVehicleType, getVehicleTypeByName } from "./models/VehicleType";
import { addNewWard, getWardByName } from "./models/WardModel";
import { removeSyncFields } from "./syncFieldCleanup";

export async function getWadas(office_id: String, user_id:String) {
  console.log("Synchronizing Wards25...");
  let res = await api.loadWada(office_id, user_id);
  if (res.status === 200) {
    let wards = res.data;
    wards.map(async (w: any) => {
      let checkWard = await getWardByName(w.name);
      if (checkWard.length === 0) {
        await addNewWard({ name: w.name, status: w.status, id: w.id });
      }
    });
    console.log(wards.length, " Wards Synced.");
    return wards;
  }
  return null;
}

export async function getSabikWards(office_id: String) {
  console.log("Synchronizing SabikWards...");
    let res = await api.loadSabikWada(office_id, "");
   if (res.status === 200) {
    let sabikWards = res.data;
    
    sabikWards.map(async (w: any) => {
    
            let checksabikWard = await getSabikWardByName(w.name);
            
      if (checksabikWard.length === 0) {
        await addNewSabikWard({
          name: w.name,
          status: w.status,
          id: w.id,
          wardId: w.ward_id,
        });
      }
    });
    console.log(sabikWards.length, " Sabikward Synced.");
  }
}

export async function getBastis(office_id: String) {
  console.log("Synchronizing Basti...");
  let res = await api.loadBasti(office_id);
  if (res.status === 200) {
    let basti = res.data;
    await Promise.all(
      basti.map(async (w: any) => {
        await updateBasti({
          id: Number(w.id),
          name: w.name,
          status: Number(w.status),
          wardId: Number(w.ward_id),
          sabikWardId: Number(w.sabik_ward_id),
        });
      })
    );
    console.log(basti.length, " Bastis Synced.");
  }
}

export async function getMargas(office_id: String) {
  console.log("Synchronizing Marga...");
  let res = await api.loadMarga(office_id);
  if (res.status === 200) {
    let margas = res.data;
    await Promise.all(
      margas.map(async (m: any) => {
        const payload = {
          id: Number(m.id),
          name: m.name,
          bastiId: Number(m.basti_id ?? m.bastiId),
          wardId: Number(m.ward_id ?? m.wardId),
          sabikWardId: Number(m.sabik_ward_id ?? m.sabikWardId),
          status: Number(m.status),
        };
        await updateMarga(payload);
      })
    );
    console.log(margas.length, " Marga Synced.");
  }
}

export async function getMotherToungure() {
  console.log("Synchronizing MT Samuha...");
  let res = await api.loadMotherTongues();
  if (res.status === 200) {
    let mother_tongues = res.data;
    mother_tongues.map(async (m: any) => {
      let checkMt = await getMotherToungueByName(m.name);
      if (checkMt.length === 0) {
        await addNewMotherToungue({ ...m });
      }
    });
    console.log(mother_tongues.length, " MT Synced.");
  }
}
export async function getJaatiSamuha() {
  console.log("Synchronizing Jaati Samuha...");
  let res = await api.loadJaatiSamuhas();
  if (res.status === 200) {
    let jaatis = res.data;
    jaatis.map(async (m: any) => {
      let checkJaati = await getJaatiSamuhaByName(m.name);
      if (checkJaati.length === 0) {
        await addNewJaatiSamuha({ ...m });
      }
    });
    console.log(jaatis.length, " Jaati Samuha Synced.");
  }
}

export async function getJaati() {
  console.log("Synchronizing Jaati...");
  let res = await api.loadJaati();
  if (res.status === 200) {
    let jaatis = res.data;
    jaatis.map(async (m: any) => {
      let checkJaati = await getJaatiByName(m.name);
      if (checkJaati.length === 0) {
        await addNewJaati({ ...m });
      }
    });
    console.log(jaatis.length, " Jaati Synced.");
  }
}
export async function getCountrySamuha() {
  console.log("Synchronizing Country Samuha...");
  let res = await api.loadCountrySamuhas();
  if (res.status === 200) {
    let Countrys = res.data;
    Countrys.map(async (m: any) => {
      let checkCountry = await getCountrySamuhaByName(m.name);
      if (checkCountry.length === 0) {
        await addNewCountrySamuha({ ...m });
      }
    });
    console.log(Countrys.length, " Country Samuha Synced.");
  }
}

export async function getCountry() {
  console.log("Synchronizing Country...");
  let res = await api.loadCountry();
  if (res.status === 200) {
    let Countrys = res.data;
    await Promise.all(
      Countrys.map(async (m: any) => {
        let checkCountry = await getCountryByName(m.name);
        const payload = {
          ...m,
          name: m.name_ne || m.name,
          name_ne: m.name_ne || m.name,
          name_en: m.name_en || m.name,
        };
        if (checkCountry.length === 0) {
          await addNewCountry(payload);
        } else {
          await db.countries.put(payload);
        }
      })
    );
    console.log(Countrys.length, " Country Synced.");
  }
}

export async function getDistrict() {
  console.log("Synchronizing District...");
  try {
    let res = await api.loadDistrict();
    if (res.status === 200) {
      let districts = Array.isArray(res.data) ? res.data : [];
      await Promise.all(
        districts.map(async (m: any) => {
          await upsertDistrict({
            id: Number(m.id),
            name: m.name_ne || m.name,
            name_ne: m.name_ne || m.name,
            name_en: m.name_en || m.name,
            status: Number(m.status ?? 1),
          });
        })
      );
      console.log(districts.length, " District Synced.");
    }
  } catch (error) {
    console.log("District sync failed.", error);
  }
}

export async function getDharma() {
  console.log("Synchronizing Dharma...");
  let res = await api.loadDharma();
  if (res.status === 200) {
    let dharmas = res.data;
    dharmas.map(async (m: any) => {
      let checkDharma = await getDharmaByName(m.name);
      if (checkDharma.length === 0) {
        await addNewDharma({ ...m });
      }
    });
    console.log(dharmas.length, " Dharma Synced.");
  }
}

export async function getOccupation() {
  console.log("Synchronizing Occupation...");
  let res = await api.loadOccupations();
  if (res.status === 200) {
    let occupations = res.data;
    occupations.map(async (m: any) => {
      let checkDharma = await getOccupationByName(m.name);
      if (checkDharma.length === 0) {
        await addNewOccupation({ ...m });
      }
    });
    console.log(occupations.length, " Occupation Synced.");
  }
}

export async function getTechnicalSkill() {
  console.log("Synchronizing Technical Skills...");
  let res = await api.loadTechnicalSkills();
  if (res.status === 200) {
    let technicalSkills = res.data;
    technicalSkills.map(async (m: any) => {
      let checkTS = await getTechnicalSkillByName(m.name);
      if (checkTS.length === 0) {
        await addNewTechnicalSkill({ ...m });
      }
    });
    console.log(technicalSkills.length, " Technical Skills Synced.");
  }
}

export async function getVehicleType() {
  console.log("Synchronizing Vehicle Types...");
  let res = await api.loadVehicleTypes();
  if (res.status === 200) {
    let vehicleTypes = res.data;
    vehicleTypes.map(async (m: any) => {
      let checkVehicleType = await getVehicleTypeByName(m.name);
      if (checkVehicleType.length === 0) {
        await addNewVehicleType({ ...m });
      }
    });
    console.log(vehicleTypes.length, " Vehicle Types Synced.");
  }
}

export async function getEducationStage() {
  console.log("Synchronizing Education Stages...");
  let res = await api.loadEducationStages();
  if (res.status === 200) {
    let stages = res.data;
    stages.map(async (m: any) => {
      let check = await getEducationStageByName(m.name);
      if (check.length === 0) {
        await addNewEducationStage({ ...m });
      }
    });
    console.log(stages.length, " Education Stages Synced.");
  }
}

export async function getProfessionCategory() {
  console.log("Synchronizing Profession Categories...");
  let res = await api.loadProfessionCategories();
  if (res.status === 200) {
    let categories = res.data;
    categories.map(async (m: any) => {
      let check = await getProfessionCategoryByName(m.name);
      if (check.length === 0) {
        await addNewProfessionCategory({ ...m });
      }
    });
    console.log(categories.length, " Profession Categories Synced.");
  }
}

export async function getProfession() {
  console.log("Synchronizing Professions...");
  let categoryRes = await api.loadProfessionCategories();
  if (categoryRes.status !== 200) return;
  let categories = categoryRes.data ?? [];
  for (const cat of categories) {
    let res = await api.loadProfessions(`${cat.id}`);
    if (res.status === 200) {
      let professions = res.data;
      professions.map(async (m: any) => {
        let check = await getProfessionByName(m.name);
        if (check.length === 0) {
          await addNewProfession({ ...m });
        }
      });
    }
  }
}

export async function getRelationWithHoh() {
  console.log("Synchronizing Relation With HouseHead...");
  let res = await api.loadRelationWithHohs();
  if (res.status === 200) {
    let relations = Array.isArray(res.data) ? res.data : [];
    await Promise.all(
      relations.map(async (m: any) => {
        let checkRelation = await getRelationWithHohByName(m.name);
        const payload = {
          id: Number(m.id),
          name: m.name,
          status: Number(m.status ?? 1),
          order: Number(m.order ?? 0),
          gender_id: m.gender_id ?? null,
          gender_name: m.gender__name ?? null,
        };
        if (checkRelation.length === 0) {
          await addNewRelationWithHoh(payload);
        } else {
          await db.relationWithHohs.put(payload as any);
        }
      })
    );
    console.log(relations.length, " Relation With HouseHead Synced.");
  }
}

const normalizeFlag = (value: any, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  return `${value}`;
};
const normalizeId = (value: any) => {
  if (value === undefined || value === null || value === "") return "";
  return `${value}`;
};

const extractSyncHouseholds = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.households)) return data.households;
  return [];
};

const clearDownloadedHouseholdData = async () => {
  await db.transaction("rw", db.households, db.members, async () => {
    await db.members.clear();
    await db.households.clear();
  });
};

export async function getHouseholdsForSync(
  office_id: String,
  user_id: String,
  sabikWardIds: string[] = []
) {
  console.log("Synchronizing Households...");
  let syncedHouseholds = 0;
  let syncedMembers = 0;
  try {
    const res = await api.loadHouseholdsForSync(office_id, user_id, sabikWardIds);
    if (res.status !== 200) {
      return { households: 0, members: 0 };
    }

    const syncHouseholds = extractSyncHouseholds(res.data);
    await clearDownloadedHouseholdData();
    const localHouseholds = await getAllHousehold();
    const householdMap = new Map<string, IHousehold>();
    localHouseholds.forEach((hh) => {
      if (hh.id_string) householdMap.set(hh.id_string, hh);
    });

    for (const remote of syncHouseholds) {
      const serverId = remote?.id;
      if (serverId === undefined || serverId === null) continue;
      const syncKey = `server-${serverId}`;
      const existing = householdMap.get(syncKey);

      const members = Array.isArray(remote.members) ? remote.members : [];
      const householdPayload: IHousehold = {
        ...removeSyncFields(remote),
        members: [],
        id_string: syncKey,
        server_household_id: serverId,
        ward_id: normalizeId(remote.ward_id),
        sabikWard_id: normalizeId(remote.sabikWard_id),
        basti_id: normalizeId(remote.basti_id),
        marga_id: normalizeId(remote.marga_id),
        is_posted: "0",
        is_complete: "0",
        is_deleted: normalizeFlag(remote.is_deleted, "0"),
        user_id: normalizeFlag(remote.user_id, `${user_id}`),
      };

      delete householdPayload.id;
      delete householdPayload.members;

      let localHhId = existing?.id;
      if (localHhId) {
        await updateHousehold({ ...householdPayload, id: localHhId });
      } else {
        localHhId = await addNewHousehold(householdPayload);
        householdMap.set(syncKey, { ...householdPayload, id: localHhId });
      }

      await db.members.where("hh_id").equals(parseInt(`${localHhId}`)).delete();
      const memberPayloads: IMember[] = members.map((member: any) => {
        const memberPayload: IMember = {
          ...removeSyncFields(member),
          hh_id: localHhId as any,
        };
        memberPayload.member_id = member.id;
        delete memberPayload.id;
        return memberPayload;
      });
      if (memberPayloads.length) {
        await db.members.bulkAdd(memberPayloads);
      }
      syncedHouseholds += 1;
      syncedMembers += memberPayloads.length;
    }
    console.log(syncHouseholds.length, " Households Synced.");
    return { households: syncedHouseholds, members: syncedMembers };
  } catch (e) {
    console.log("Household sync skipped.", e);
    return { households: syncedHouseholds, members: syncedMembers };
  }
}

export async function syncInactiveMembers() {
  console.log("Synchronizing Inactive Members...");
  let syncedMembers = 0;
  try {
    const res = await api.loadInactiveMembers();
    if (res.status !== 200) {
      return 0;
    }

    const inactiveMembers = Array.isArray(res.data) ? res.data : [];
    const localMembers = await db.members.toArray();

    for (const remote of inactiveMembers) {
      const remoteId = `${remote?.member_id ?? remote?.id ?? ""}`;
      if (!remoteId) continue;

      const existing = localMembers.find(
        (member: any) =>
          `${member?.member_id ?? ""}` === remoteId ||
          `${member?.id ?? ""}` === remoteId
      );

      const memberPayload: any = {
        ...existing,
        ...removeSyncFields(remote),
        id: existing?.id,
        member_id: Number(remoteId),
        hh_id: `${remote?.hh_id ?? existing?.hh_id ?? ""}`,
        status: "0",
      };

      await db.members.put(memberPayload);
      syncedMembers += 1;
    }

    console.log(inactiveMembers.length, " Inactive Members Synced.");
    return syncedMembers;
  } catch (error) {
    console.log("Inactive member sync failed.", error);
    return syncedMembers;
  }
}

export async function syncSettingData(data: any) {
  if (!window.navigator.onLine) {
    return;
  }

  await getWadas(data.office_id, data.id);
  await getSabikWards(data.office_id);
  await getBastis(data.office_id);
  await getMargas(data.office_id);
  await getJaati();
  await getJaatiSamuha();
  await getDharma();
  await getOccupation();
  await getEducationStage();
  await getProfessionCategory();
  await getProfession();
  await getRelationWithHoh();
  await getTechnicalSkill();
  await getVehicleType();
  await getMotherToungure();
  await getDistrict();
  await getCountrySamuha();
  await getCountry();
}

export async function syncHouseholdData(data: any, options?: { sabikWardIds?: string[] }) {
  const result = { households: 0, members: 0, inactiveMembers: 0 };
  if (window.navigator.onLine) {
    const householdSync = await getHouseholdsForSync(
      data.office_id,
      data.id,
      options?.sabikWardIds ?? []
    );
    result.households = householdSync?.households ?? 0;
    result.members = householdSync?.members ?? 0;
    result.inactiveMembers = await syncInactiveMembers();
  }
  return result;
}

export async function syncDb(data: any, options?: { sabikWardIds?: string[] }) {
  const result = { households: 0, members: 0 };
  if (window.navigator.onLine) {
    await syncSettingData(data);
    const householdSync = await syncHouseholdData(data, options);
    result.households = householdSync?.households ?? 0;
    result.members = (householdSync?.members ?? 0) + (householdSync?.inactiveMembers ?? 0);
  }
  return result;
}
