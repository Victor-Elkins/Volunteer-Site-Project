const express = require('express');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const db = require('../db'); // Database connection

const router = express.Router();

// Helper functions to fetch data from the database
const getVolunteerHistory = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT vc.username, vh.participation_date, ed.event_name, ed.location
      FROM VolunteerHistory vh
      JOIN UserCredentials vc ON vh.user_id = vc.id
      JOIN EventDetails ed ON vh.event_id = ed.id;
    `;
    db.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getEventAssignments = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ed.event_name, ed.description, ed.location, ed.required_skills, ed.event_date, vc.username
      FROM EventDetails ed
      LEFT JOIN VolunteerHistory vh ON ed.id = vh.event_id
      LEFT JOIN UserCredentials vc ON vh.user_id = vc.id;
    `;
    db.all(query, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Route to get volunteer history data as JSON
router.get('/volunteer-history', async (req, res) => {
  try {
    const data = await getVolunteerHistory();
    res.json(data);
  } catch (error) {
    console.error('Error fetching volunteer history:', error.message);
    res.status(500).json({ message: 'Database error' });
  }
});

// Route to get event assignments data as JSON
router.get('/event-assignments', async (req, res) => {
  try {
    const data = await getEventAssignments();
    res.json(data);
  } catch (error) {
    console.error('Error fetching event assignments:', error.message);
    res.status(500).json({ message: 'Database error' });
  }
});

// Route to generate a PDF report
router.get('/generate-pdf/:type', async (req, res) => {
  const { type } = req.params;
  let data;

  try {
    if (type === 'volunteer-history') {
      data = await getVolunteerHistory();
    } else if (type === 'event-assignments') {
      data = await getEventAssignments();
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', `attachment; filename=${type}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(18).text(`Report: ${type.replace('-', ' ').toUpperCase()}`, { align: 'center' });
    doc.moveDown();

    data.forEach(item => {
      doc.fontSize(12).text(JSON.stringify(item, null, 2));
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// Route to generate a CSV report
router.get('/generate-csv/:type', async (req, res) => {
  const { type } = req.params;
  let data;

  try {
    if (type === 'volunteer-history') {
      data = await getVolunteerHistory();
    } else if (type === 'event-assignments') {
      data = await getEventAssignments();
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    const csv = new Parser().parse(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error.message);
    res.status(500).json({ message: 'Error generating CSV' });
  }
});

module.exports = router;