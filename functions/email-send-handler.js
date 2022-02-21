import functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';
import admin from 'firebase-admin';

const config = functions.config();
admin.initializeApp(config.firebase);
const BQ_DATASET = config.mailcheck?.bq_mail_send_dataset;
const BQ_TABLE = config.mailcheck?.bq_mail_send_table;

/** @type {import('@google-cloud/bigquery').Table} */
let bigQueryEmailSendTable;
try {
  const bigQuery = new BigQuery({ projectId: config.mailcheck.bq_project_id });
  bigQueryEmailSendTable = bigQuery.dataset(BQ_DATASET).table(BQ_TABLE);
} catch (err) {
  functions.logger.error(err);
}

/**
 * @param {functions.Request} req
 * @param {functions.Response} res
 */
export default async function (req, res) {
  const row = {
    timestamp: req.body.timestamp || new Date(),
    click_id: req.body.clickid || '',
    email: req.body.email,
    template: req.body.template,
    receiver: req.body.subject,
    status: req.body.status
  };

  try {
    await bigQueryEmailSendTable?.insert(row);
    return res.sendStatus(200);
  } catch (err) {
    functions.logger.error(err);
    res.sendStatus(500);
  }
}
