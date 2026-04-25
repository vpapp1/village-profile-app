export const HOUSEHOLD_PAGE_SIZE = 20;

export const getBackendHouseholdId = (source: any) =>
  source?.household_id ?? source?.houshold_id ?? source?.househol_id;

export const getHouseholdCode = (hh: any) => {
  return `${getBackendHouseholdId(hh) ?? hh.id_string ?? hh.id ?? ""}`.trim();
};

export const getHouseholdHead = (hh: any) => {
  const members = hh.members ?? [];
  const hohMember =
    members.find((member: any) => `${member?.is_hoh ?? ""}` === "1") ??
    members.find((member: any) => `${member?.relation_with_hoh_id ?? ""}` === "1");

  if (hohMember) {
    return `${hohMember?.first_name ?? ""} ${hohMember?.last_name ?? ""}`.trim();
  }

  return `${hh?.hoh_first_name ?? ""} ${hh?.hoh_last_name ?? ""}`.trim();
};

export const getHouseholdMobile = (hh: any) => {
  const members = hh.members ?? [];
  const hohMember =
    members.find((member: any) => `${member?.is_hoh ?? ""}` === "1") ??
    members.find((member: any) => `${member?.relation_with_hoh_id ?? ""}` === "1");

  return hohMember?.mobile_num ?? hohMember?.phone_num ?? hh.hoh_contact_num ?? hh.mobile_num ?? "-";
};

export const getActiveMemberCount = (hh: any) => {
  const members = hh.members ?? [];
  return members.filter(
    (member: any) => `${member?.status ?? ""}` !== "0" && `${member?.status ?? ""}` !== "2"
  ).length;
};

export const getHouseholdLocation = (
  hh: any,
  bastiNames: Record<string, string>,
  margaNames: Record<string, string>
) => {
  const bastiName = bastiNames[`${hh?.basti_id ?? ""}`] ?? "";
  const margaName = margaNames[`${hh?.marga_id ?? ""}`] ?? "";
  return [bastiName, margaName].filter(Boolean).join(" / ") || "-";
};

export const householdMatchesSearch = (
  hh: any,
  searchText: string,
  bastiNames: Record<string, string>,
  margaNames: Record<string, string>
) => {
  const query = searchText.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const searchableText = [
    getHouseholdCode(hh),
    getHouseholdHead(hh),
    getHouseholdMobile(hh),
    bastiNames[`${hh?.basti_id ?? ""}`],
    margaNames[`${hh?.marga_id ?? ""}`],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
};

export const getPageCount = (itemCount: number) => {
  return Math.max(1, Math.ceil(itemCount / HOUSEHOLD_PAGE_SIZE));
};
