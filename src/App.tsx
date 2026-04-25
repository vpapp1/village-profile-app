import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import PendingData from "./Components/VillageProfile/PendingData";
import VillageProfileHome from "./Components/VillageProfileHome";
import "./App.css";
import "./bootstrap.css";
import { db } from "./db/db";
import AllData from "./Components/VillageProfile/AllData";
import DeleteHousehold from "./Components/VillageProfile/DeleteHousehold";
import EditHousehold from "./Components/VillageProfile/EditHousehold";
import AddHousehold from "./Components/VillageProfile/AddHousehold";
import IncompleteData from "./Components/VillageProfile/IncompleteData";
import ViewHousehold from "./Components/VillageProfile/ViewHousehold";
import SentData from "./Components/VillageProfile/SentData";

export default function App() {
  db.open();
  return (
    <Switch>
      <Route path="/village-profile-app/app/add-new">
        <AddHousehold />
      </Route>
      <Route
        path="/village-profile-app/app/delete/:id"
        children={<DeleteHousehold/>}
      />
      <Route
        path="/village-profile-app/app/edit/:id"
        children={<EditHousehold />}
      />
      <Route
        path="/village-profile-app/app/view/:id"
        children={<ViewHousehold />}
      />
      <Route path="/village-profile-app/app/pending">
        <PendingData />
      </Route>
      <Route path="/village-profile-app/app/incomplete">
        <IncompleteData />
      </Route>
      <Route path="/village-profile-app/app/sent">
        <SentData />
      </Route>
      <Route path="/village-profile-app/app/all">
        <AllData />
      </Route>
      <Route path="/village-profile-app/app">
        <VillageProfileHome />
      </Route>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/village-profile-app">
        <Home />
      </Route>
    </Switch>
  );
}
