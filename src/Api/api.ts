import axios from "axios";
import { IUser } from "../db/models/UserModel";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
const server = `${process.env.REACT_APP_SERVER}`;
const householdSyncEndpoint =
  process.env.REACT_APP_HOUSEHOLD_SYNC_ENDPOINT || "households-export/";
const api = {
  loadWada: (office_id: String, user_id: String) => axios.get(`${server}wards/`, {params: {office_id: office_id, user_id: user_id}}),
  loadWadaByUser: (office_id:String, user_id: String) => axios.get(`${server}wards/`, {params: {office_id: office_id, user_id:user_id}}),
  loadSabikWada: (office_id: String) => axios.get(`${server}sabik-wards/`, {params: {office_id: office_id}}),
  loadMarga: (office_id: String) => axios.get(`${server}margas/`, {params: {office_id: office_id}}),
  loadBasti: (office_id: String) => axios.get(`${server}bastis/`, {params: {office_id: office_id}}),
  loadJaati: () => axios.get(`${server}jaatis/`),
  loadJaatiSamuhas: () => axios.get(`${server}jaati-samuhas/`),
  loadCountry: () => axios.get(`${server}countries/`),
  loadCountrySamuhas: () => axios.get(`${server}country-samuhas/`),
  loadMotherTongues: () => axios.get(`${server}mother-tongues/`),
  loadDharma: () => axios.get(`${server}dharmas/`),
  loadOccupations: () => axios.get(`${server}occupations/`),
  loadTechnicalSkills: () => axios.get(`${server}technical-skills/`),
  loadEducationStages: () => axios.get(`${server}education-stages/`),
  loadProfessionCategories: () => axios.get(`${server}profession-categories/`),
  loadProfessions: (profession_category_id: string) =>
    axios.get(`${server}professions/`, { params: { profession_category_id } }),
  loadHouseholdsForSync: (office_id: String, user_id: String) =>
    axios.get(`${server}${householdSyncEndpoint}`, {
      params: { office_id: office_id, user_id: user_id },
    }),
  login: (auth: IUser) => axios.post(`${server}login/`, { data: auth }),
  loginJsonServer: () => axios.get(`${server}login/`),
  
  postHousehold: (data: any) => axios.post(`${server}post-household/`, { data }),
};

export default api;
