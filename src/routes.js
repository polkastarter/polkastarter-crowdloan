/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import AccountBox from "@material-ui/icons/AccountBox";
import DashboardPage from "views/Dashboard/Dashboard";
import CampaignsPage from "views/Campaign";

const dashboardRoutes = [
  {
    path: "/",
    name: "Crowdloans",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/"
  }
];

export default dashboardRoutes;
