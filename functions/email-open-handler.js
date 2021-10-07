import functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';
import admin from 'firebase-admin';

const config = functions.config();
admin.initializeApp(config.firebase);
const BQ_DATASET = config.mailcheck?.bq_mail_open_dataset;
const BQ_TABLE = config.mailcheck?.bq_mail_open_table;

/** @type {import('@google-cloud/bigquery').Table} */
let bigQueryEmailOpenTable;
try {
  const bigQuery = new BigQuery({ projectId: config.mailcheck.bq_project_id });
  bigQueryEmailOpenTable = bigQuery.dataset(BQ_DATASET).table(BQ_TABLE);
} catch (err) {
  functions.logger.error(err);
}

/**
 * @param {functions.Request} req
 * @param {functions.Response} res
 */
export default async function (req, res) {
  const row = {
    timestamp: new Date(),
    click_id: req.query.clickid,
    user_agent: req.get('User-Agent'),
    ip: req.get('CF-Connecting-IP'),
    email: req.query.email
  };
  await bigQueryEmailOpenTable?.insert(row);
  res.sendFile(path.resolve('./assets/logo-1.png'));
}
