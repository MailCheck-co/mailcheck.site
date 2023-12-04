import functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';
import admin from 'firebase-admin';

const config = functions.config();
admin.initializeApp(config.firebase);
const BQ_DATASET = config.mailcheck?.bq_mail_status_dataset;
const BQ_TABLE = config.mailcheck?.bq_mail_status_table;

/** @type {import('@google-cloud/bigquery').Table} */
let bigQueryEmailStatusTable;
try {
  const bigQuery = new BigQuery({ projectId: config.mailcheck.bq_project_id });
  bigQueryEmailStatusTable = bigQuery.dataset(BQ_DATASET).table(BQ_TABLE);
  functions.logger.info('Connected to BQ');
} catch (err) {
  functions.logger.error(err);
}

/**
 * @param {functions.Request} req
 * @param {functions.Response} res
 */
export default async function (req, res) {
  const rows = req.body.records;

  try {
    await bigQueryEmailStatusTable?.insert(rows);
    return res.sendStatus(200);
  } catch (err) {
    functions.logger.error(err);
    functions.logger.error(err.errors[0]);
    res.sendStatus(500);
  }
}
