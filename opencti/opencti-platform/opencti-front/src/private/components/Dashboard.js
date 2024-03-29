import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { compose, head, pathOr } from 'ramda';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import {
  AssignmentOutlined,
  LayersOutlined,
  WorkOutline,
  DescriptionOutlined,
} from '@material-ui/icons';
import { Database, HexagonOutline } from 'mdi-material-ui';
import BarChart from 'recharts/lib/chart/BarChart';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import Bar from 'recharts/lib/cartesian/Bar';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import { QueryRenderer } from '../../relay/environment';
import { monthsLatter, dayAgo, daysAgo } from '../../utils/Time';
import Theme from '../../components/Theme';
import inject18n from '../../components/i18n';
import ItemNumberDifference from '../../components/ItemNumberDifference';
import ItemMarking from '../../components/ItemMarking';
import Loader from '../../components/Loader';
import Security, { KNOWLEDGE } from '../../utils/Security';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 6,
    position: 'relative',
  },
  paper: {
    height: '100%',
    minHeight: 200,
    margin: '10px 0 20px 0',
    padding: 0,
    borderRadius: 6,
  },
  item: {
    height: 50,
    minHeight: 50,
    maxHeight: 50,
    paddingRight: 0,
  },
  itemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 10,
  },
  itemIconSecondary: {
    marginRight: 0,
    color: theme.palette.secondary.main,
  },
  number: {
    marginTop: 10,
    float: 'left',
    fontSize: 30,
  },
  title: {
    marginTop: 5,
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 500,
    color: '#a8a8a8',
  },
  icon: {
    position: 'absolute',
    color: theme.palette.primary.main,
    top: 35,
    right: 20,
  },
  graphContainer: {
    width: '100%',
    margin: '20px 0 0 -30px',
  },
});

const inlineStyles = {
  itemAuthor: {
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    marginRight: 24,
    marginLeft: 24,
    color: '#ffffff',
  },
  itemType: {
    width: 100,
    minWidth: 100,
    maxWidth: 100,
    marginRight: 24,
    marginLeft: 24,
    color: '#ffffff',
  },
  itemDate: {
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    marginRight: 24,
    color: '#ffffff',
  },
};

const dashboardStixDomainEntitiesTimeSeriesQuery = graphql`
  query DashboardStixDomainEntitiesTimeSeriesQuery(
    $field: String!
    $operation: StatsOperation!
    $startDate: DateTime!
    $endDate: DateTime!
    $interval: String!
  ) {
    stixDomainEntitiesTimeSeries(
      field: $field
      operation: $operation
      startDate: $startDate
      endDate: $endDate
      interval: $interval
    ) {
      date
      value
    }
  }
`;

const dashboardLastReportsQuery = graphql`
  query DashboardLastReportsQuery(
    $first: Int
    $orderBy: ReportsOrdering
    $orderMode: OrderingMode
  ) {
    reports(first: $first, orderBy: $orderBy, orderMode: $orderMode) {
      edges {
        node {
          id
          name
          description
          published
          createdByRef {
            node {
              name
            }
          }
          markingDefinitions {
            edges {
              node {
                definition
              }
            }
          }
        }
      }
    }
  }
`;

const dashboardLastObservablesQuery = graphql`
  query DashboardLastObservablesQuery(
    $first: Int
    $orderBy: StixObservablesOrdering
    $orderMode: OrderingMode
  ) {
    stixObservables(first: $first, orderBy: $orderBy, orderMode: $orderMode) {
      edges {
        node {
          id
          entity_type
          observable_value
          description
          created_at
          markingDefinitions {
            edges {
              node {
                definition
              }
            }
          }
        }
      }
    }
  }
`;

const dashboardStixDomainEntitiesNumberQuery = graphql`
  query DashboardStixDomainEntitiesNumberQuery(
    $types: [String]
    $endDate: DateTime
  ) {
    stixDomainEntitiesNumber(types: $types, endDate: $endDate) {
      total
      count
    }
  }
`;

const dashboardStixObservablesNumberQuery = graphql`
  query DashboardStixObservablesNumberQuery(
    $types: [String]
    $endDate: DateTime
  ) {
    stixObservablesNumber(types: $types, endDate: $endDate) {
      total
      count
    }
  }
`;

class Dashboard extends Component {
  render() {
    const {
      t, n, nsd, classes,
    } = this.props;
    const stixDomainEntitiesTimeSeriesVariables = {
      field: 'created_at',
      operation: 'count',
      startDate: daysAgo(8),
      endDate: monthsLatter(3),
      interval: 'day',
    };
    return (
      <div className={classes.root}>
        <Security
          needs={[KNOWLEDGE]}
          placeholder={t(
            'You do not have any access to the knowledge of this OpenCTI instance.',
          )}
        >
          <Grid container={true} spacing={2}>
            <Grid item={true} lg={3} xs={6}>
              <Card classes={{ root: classes.card }} style={{ height: 110 }}>
                <QueryRenderer
                  query={dashboardStixDomainEntitiesNumberQuery}
                  variables={{ endDate: dayAgo() }}
                  render={({ props }) => {
                    if (props && props.stixDomainEntitiesNumber) {
                      const { total } = props.stixDomainEntitiesNumber;
                      const difference = total - props.stixDomainEntitiesNumber.count;
                      return (
                        <CardContent>
                          <div className={classes.title}>
                            {t('Total entities')}
                          </div>
                          <div className={classes.number}>{n(total)}</div>
                          <ItemNumberDifference difference={difference} />
                          <div className={classes.icon}>
                            <Database color="inherit" fontSize="large" />
                          </div>
                        </CardContent>
                      );
                    }
                    return <Loader variant="inElement" />;
                  }}
                />
              </Card>
              <Card classes={{ root: classes.card }} style={{ height: 110 }}>
                <QueryRenderer
                  query={dashboardStixDomainEntitiesNumberQuery}
                  variables={{ types: ['report'], endDate: dayAgo() }}
                  render={({ props }) => {
                    if (props && props.stixDomainEntitiesNumber) {
                      const { total } = props.stixDomainEntitiesNumber;
                      const difference = total - props.stixDomainEntitiesNumber.count;
                      return (
                        <CardContent>
                          <div className={classes.title}>
                            {t('Total reports')}
                          </div>
                          <div className={classes.number}>{n(total)}</div>
                          <ItemNumberDifference difference={difference} />
                          <div className={classes.icon}>
                            <AssignmentOutlined
                              color="inherit"
                              fontSize="large"
                            />
                          </div>
                        </CardContent>
                      );
                    }
                    return <Loader variant="inElement" />;
                  }}
                />
              </Card>
            </Grid>
            <Grid item={true} lg={3} xs={6}>
              <Card classes={{ root: classes.card }} style={{ height: 110 }}>
                <QueryRenderer
                  query={dashboardStixObservablesNumberQuery}
                  variables={{ endDate: dayAgo() }}
                  render={({ props }) => {
                    if (props && props.stixObservablesNumber) {
                      const { total } = props.stixObservablesNumber;
                      const difference = total - props.stixObservablesNumber.count;
                      return (
                        <CardContent>
                          <div className={classes.title}>
                            {t('Total observables')}
                          </div>
                          <div className={classes.number}>{n(total)}</div>
                          <ItemNumberDifference difference={difference} />
                          <div className={classes.icon}>
                            <LayersOutlined color="inherit" fontSize="large" />
                          </div>
                        </CardContent>
                      );
                    }
                    return <Loader variant="inElement" />;
                  }}
                />
              </Card>
              <Card classes={{ root: classes.card }} style={{ height: 110 }}>
                <QueryRenderer
                  query={dashboardStixDomainEntitiesNumberQuery}
                  variables={{ types: ['note'], endDate: dayAgo() }}
                  render={({ props }) => {
                    if (props && props.stixDomainEntitiesNumber) {
                      const { total } = props.stixDomainEntitiesNumber;
                      const difference = total - props.stixDomainEntitiesNumber.count;
                      return (
                        <CardContent>
                          <div className={classes.title}>
                            {t('Total notes')}
                          </div>
                          <div className={classes.number}>{n(total)}</div>
                          <ItemNumberDifference difference={difference} />
                          <div className={classes.icon}>
                            <WorkOutline color="inherit" fontSize="large" />
                          </div>
                        </CardContent>
                      );
                    }
                    return <Loader variant="inElement" />;
                  }}
                />
              </Card>
            </Grid>
            <Grid item={true} lg={6} xs={12}>
              <Card classes={{ root: classes.card }} style={{ height: 240 }}>
                <CardContent>
                  <div className={classes.title}>{t('Ingested entities')}</div>
                  <div className={classes.graphContainer}>
                    <QueryRenderer
                      query={dashboardStixDomainEntitiesTimeSeriesQuery}
                      variables={stixDomainEntitiesTimeSeriesVariables}
                      render={({ props }) => {
                        if (props && props.stixDomainEntitiesTimeSeries) {
                          return (
                            <ResponsiveContainer height={170} width="100%">
                              <BarChart
                                data={props.stixDomainEntitiesTimeSeries}
                                margin={{
                                  top: 5,
                                  right: 5,
                                  bottom: 25,
                                  left: 20,
                                }}
                              >
                                <XAxis
                                  dataKey="date"
                                  stroke="#ffffff"
                                  interval={15}
                                  angle={-45}
                                  textAnchor="end"
                                  tickFormatter={nsd}
                                />
                                <YAxis stroke="#ffffff" />
                                <CartesianGrid
                                  strokeDasharray="2 2"
                                  stroke="#0f181f"
                                />
                                <Tooltip
                                  cursor={{
                                    fill: 'rgba(0, 0, 0, 0.2)',
                                    stroke: 'rgba(0, 0, 0, 0.2)',
                                    strokeWidth: 2,
                                  }}
                                  contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    fontSize: 12,
                                    borderRadius: 10,
                                  }}
                                  labelFormatter={nsd}
                                />
                                <Bar
                                  fill={Theme.palette.primary.main}
                                  dataKey="value"
                                  barSize={10}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          );
                        }
                        return <Loader variant="inElement" />;
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container={true} spacing={2}>
            <Grid item={true} lg={6} xs={12} style={{ marginBottom: 30 }}>
              <Typography variant="h2" gutterBottom={true}>
                {t('Last reports')}
              </Typography>
              <Paper classes={{ root: classes.paper }} elevation={2}>
                <QueryRenderer
                  query={dashboardLastReportsQuery}
                  variables={{
                    first: 20,
                    orderBy: 'published',
                    orderMode: 'desc',
                  }}
                  render={({ props }) => {
                    if (props && props.reports) {
                      return (
                        <List>
                          {props.reports.edges.map((reportEdge) => {
                            const report = reportEdge.node;
                            const markingDefinition = head(
                              pathOr(
                                [],
                                ['markingDefinitions', 'edges'],
                                report,
                              ),
                            );
                            return (
                              <ListItem
                                key={report.id}
                                dense={true}
                                button={true}
                                classes={{ root: classes.item }}
                                divider={true}
                                component={Link}
                                to={`/dashboard/reports/all/${report.id}`}
                              >
                                <ListItemIcon>
                                  <DescriptionOutlined color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <div className={classes.itemText}>
                                      {report.name}
                                    </div>
                                  }
                                />
                                <div style={inlineStyles.itemAuthor}>
                                  {pathOr(
                                    '',
                                    ['createdByRef', 'node', 'name'],
                                    report,
                                  )}
                                </div>
                                <div style={inlineStyles.itemDate}>
                                  {nsd(report.published)}
                                </div>
                                <div style={{ marginRight: 20 }}>
                                  {markingDefinition ? (
                                    <ItemMarking
                                      key={markingDefinition.node.id}
                                      label={markingDefinition.node.definition}
                                      variant="inList"
                                    />
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </ListItem>
                            );
                          })}
                        </List>
                      );
                    }
                    return <Loader variant="inElement" />;
                  }}
                />
              </Paper>
            </Grid>
            <Grid item={true} lg={6} xs={12} style={{ marginBottom: 30 }}>
              <Typography variant="h2" gutterBottom={true}>
                {t('Last observables')}
              </Typography>
              <Paper classes={{ root: classes.paper }} elevation={2}>
                <QueryRenderer
                  query={dashboardLastObservablesQuery}
                  variables={{
                    first: 20,
                    orderBy: 'created_at',
                    orderMode: 'desc',
                  }}
                  render={({ props }) => {
                    if (props && props.stixObservables) {
                      return (
                        <List>
                          {props.stixObservables.edges.map(
                            (stixObservableEdge) => {
                              const stixObservable = stixObservableEdge.node;
                              const markingDefinition = head(
                                pathOr(
                                  [],
                                  ['markingDefinitions', 'edges'],
                                  stixObservable,
                                ),
                              );
                              return (
                                <ListItem
                                  key={stixObservable.id}
                                  dense={true}
                                  button={true}
                                  classes={{ root: classes.item }}
                                  divider={true}
                                  component={Link}
                                  to={`/dashboard/signatures/observables/${stixObservable.id}`}
                                >
                                  <ListItemIcon>
                                    <HexagonOutline color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <div className={classes.itemText}>
                                        {stixObservable.observable_value}
                                      </div>
                                    }
                                  />
                                  <div style={inlineStyles.itemType}>
                                    {t(
                                      `observable_${stixObservable.entity_type}`,
                                    )}
                                  </div>
                                  <div style={inlineStyles.itemDate}>
                                    {nsd(stixObservable.created_at)}
                                  </div>
                                  <div style={{ marginRight: 20 }}>
                                    {markingDefinition ? (
                                      <ItemMarking
                                        key={markingDefinition.node.id}
                                        label={
                                          markingDefinition.node.definition
                                        }
                                        variant="inList"
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </ListItem>
                              );
                            },
                          )}
                        </List>
                      );
                    }
                    return <Loader variant="inElement" />;
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Security>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  n: PropTypes.func,
  nsd: PropTypes.func,
  md: PropTypes.func,
  history: PropTypes.object,
};

export default compose(inject18n, withStyles(styles))(Dashboard);
