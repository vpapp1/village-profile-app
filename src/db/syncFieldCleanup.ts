const removedSyncFields = new Set([
  "has_pregchild_health",
  "has_pregnant_member",
  "has_pregnancy_test",
  "pregnancy_test_count",
  "has_maternity_member",
  "has_maternity_test",
  "maternity_location",
  "has_maternity_death",
  "maternity_death_condition",
  "child_death",
  "child_death_condition",
  "child_death_count",
  "has_smartphone",
  "nearest_road_distance_minute",
  "public_vehicle_distance_minute",
  "nearest_hospital_distance",
  "hospital_distance_minute",
  "primary_distance",
  "secondary_distance",
  "higher_secondary_distance",
  "hoh_income_amount",
  "hoh_expense_amount",
  "feelings_for_local_government",
  "gov_complaint",
  "form_complaint",
  "main_occupation_id",
  "other_occupation_id",
  "profession_category_id",
  "profession_id",
  "profession_type",
  "has_bank_account",
  "has_health_insurance",
  "has_life_insurance",
  "has_cooperative_account",
  "has_informal_education",
  "has_technical_training",
]);

export const removeSyncFields = <T extends Record<string, any>>(source: T) => {
  return Object.keys(source).reduce((payload: any, field) => {
    if (!removedSyncFields.has(field)) {
      payload[field] = source[field];
    }
    return payload;
  }, {});
};
