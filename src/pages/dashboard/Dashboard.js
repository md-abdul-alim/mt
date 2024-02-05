import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import axios from "axios";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";

// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";

const mainChartData = getMainChartData();
const PieChartData = [
  { name: "Group A", value: 400, color: "primary" },
  { name: "Group B", value: 300, color: "secondary" },
  { name: "Group C", value: 300, color: "warning" },
  { name: "Group D", value: 200, color: "success" },
];

export default function Dashboard(props) {
  var classes = useStyles();
  const [dashboardData, setDashboardData] = useState([]);
  var theme = useTheme();
  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

  async function fetchDashboardData() {

    try {
      await axios
        .get("/api/dashboard/", AxiosHeader)
        .then((res) => {
          setDashboardData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const CustomTooltip = ({ active, payload, label, name }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <span className="intro">{payload[0].payload.month}</span>
          <p className="label">{`${name} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  // local
  var [mainChartState, setMainChartState] = useState("monthly");
  

  return (
    <>
      <BreadCrumb routeSegments={[{ name: "Dashboard" }]} />
        <Grid container spacing={4} className={classes.pageContent}>
          <Grid item xs={12}>
            <Typography size="xl" weight="medium" noWrap>
              Dekko Machines
            </Typography>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="Total Machines"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.machine_count}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Widget
              title="Total Active Machines"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.active_machine_count}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Widget
              title="Total Rejected Machines"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.rejected_machine_count}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="Total Units"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.unit_count}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="Total Lines"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.line_count}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>

          <Grid item xs={12}>
            <Typography size="xl" weight="medium" noWrap>
              Factory Wise IDLE Machines (Excluding Utility Machines)
            </Typography>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="DGL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.dgl_ideal_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="DRL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.drl_ideal_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="GGL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.ggl_ideal_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="AFL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.afl_ideal_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="AWL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.awl_ideal_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="DAL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.dal_ideal_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>

          <Grid item xs={12}>
            <Typography size="xl" weight="medium" noWrap>
              Rent Machines
            </Typography>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="DGL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.dgl_rent_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="DRL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.drl_rent_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="GGL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.ggl_rent_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="AFL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.afl_rent_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="DAL"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.dal_rent_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>
          <Grid item lg={2} md={4} sm={6} xs={12}>
            <Widget
              title="Total Rent Machines"
              upperTitle
              bodyClass={classes.fullHeightBody}
              className={classes.card}
            >
              <div className={classes.visitsNumberContainer}>
                <Grid container item alignItems={"center"}>
                  <Grid item xs={6}>
                    <Typography size="xl" weight="medium" noWrap>
                      {dashboardData.total_rent_machines}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Widget>
          </Grid>

          <Grid item xs={12}>
            <Widget
              bodyClass={classes.mainChartBody}
              header={
                <div className={classes.mainChartHeader}>
                  <Typography
                    variant="h5"
                    color="text"
                    colorBrightness="secondary"
                  >
                    Month wise Line Chart
                  </Typography>
                  <div className={classes.mainChartHeaderLabels}>
                    <div className={classes.mainChartHeaderLabel}>
                      <Dot color="warning" />
                      <Typography className={classes.mainChartLegentElement}>
                        Machine
                      </Typography>
                    </div>
                    <div className={classes.mainChartHeaderLabel}>
                      <Dot color="primary" />
                      <Typography className={classes.mainChartLegentElement}>
                        Unit
                      </Typography>
                    </div>
                    {/* <div className={classes.mainChartHeaderLabel}>
                      <Dot color="secondary" />
                      <Typography className={classes.mainChartLegentElement}>
                        Line
                      </Typography>
                    </div> */}
                  </div>
                </div>
              }
            >
              <ResponsiveContainer width="100%" minWidth={500} height={350}>
                <ComposedChart
                  margin={{ top: 0, right: -15, left: -15, bottom: 0 }}
                  data={dashboardData.machine_unit_monthly_count}
                >
                  <YAxis
                    // ticks={[0, 2500, 5000, 7500]}
                    tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                    stroke={theme.palette.text.hint + "80"}
                    tickLine={false}
                  />
                  <XAxis
                    dataKey="month"
                    // tickFormatter={i => i + 1}
                    tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                    stroke={theme.palette.text.hint + "80"}
                    tickLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="machine"
                    stroke={theme.palette.warning.main}
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="unit"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{
                      stroke: theme.palette.primary.dark,
                      strokeWidth: 2,
                      fill: theme.palette.primary.main,
                    }}
                  />
                  {/* <Line
                    type="monotone"
                    dataKey="fabric"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="linear"
                    dataKey="style"
                    stroke={theme.palette.warning.main}
                    strokeWidth={2}
                    dot={{
                      stroke: theme.palette.warning.dark,
                      strokeWidth: 2,
                      fill: theme.palette.warning.main,
                    }}
                  /> */}
                </ComposedChart>
              </ResponsiveContainer>
            </Widget>
          </Grid>
        </Grid>
    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((item, index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }
  return resultArray;
}
