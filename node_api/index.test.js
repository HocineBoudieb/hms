const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = require('./index'); // Assuming your main file is named index.js

// FILE: node_api/index.test.js


jest.mock('@prisma/client');
const prisma = new PrismaClient();

describe('API Tests', () => {
  beforeAll(() => {
    app.use(express.json());
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /antennas', () => {
    it('should fetch all antennas', async () => {
      prisma.antenna.findMany.mockResolvedValue([{ id: 1, name: 'Antenna 1' }]);
      const res = await request(app).get('/antennas');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ id: 1, name: 'Antenna 1' }]);
    });

    it('should handle errors', async () => {
      prisma.antenna.findMany.mockRejectedValue(new Error('Failed to fetch antennas.'));
      const res = await request(app).get('/antennas');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to fetch antennas.' });
    });
  });

  describe('GET /encours', () => {
    it('should fetch all EnCours', async () => {
      prisma.enCours.findMany.mockResolvedValue([{ id: 1, name: 'EnCours 1' }]);
      const res = await request(app).get('/encours');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ id: 1, name: 'EnCours 1' }]);
    });

    it('should handle errors', async () => {
      prisma.enCours.findMany.mockRejectedValue(new Error('Failed to fetch EnCours.'));
      const res = await request(app).get('/encours');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to fetch EnCours.' });
    });
  });

  describe('GET /workshops', () => {
    it('should fetch all workshops', async () => {
      prisma.workshop.findMany.mockResolvedValue([{ id: 1, name: 'Workshop 1' }]);
      const res = await request(app).get('/workshops');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ id: 1, name: 'Workshop 1' }]);
    });

    it('should handle errors', async () => {
      prisma.workshop.findMany.mockRejectedValue(new Error('Failed to fetch workshops.'));
      const res = await request(app).get('/workshops');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to fetch workshops.' });
    });
  });

  describe('POST /workshops', () => {
    it('should create a new workshop', async () => {
      const newWorkshop = { id: 1, name: 'Workshop 1', startDate: '2023-01-01', endDate: '2023-01-02', EnCoursId: 1 };
      prisma.workshop.create.mockResolvedValue(newWorkshop);
      const res = await request(app).post('/workshops').send(newWorkshop);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(newWorkshop);
    });

    it('should handle errors', async () => {
      prisma.workshop.create.mockRejectedValue(new Error('Failed to create workshop.'));
      const res = await request(app).post('/workshops').send({ name: 'Workshop 1' });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to create workshop.' });
    });
  });

  describe('POST /antennas/:id/rfids', () => {
    it('should register new RFIDs', async () => {
      const rfids = ['rfid1', 'rfid2'];
      prisma.rfid.create.mockResolvedValue({ id: 1, reference: 'rfid1' });
      const res = await request(app).post('/antennas/0/rfids').send({ rfids });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ id: 1, reference: 'rfid1' }]);
    });

    it('should handle errors', async () => {
      prisma.rfid.create.mockRejectedValue(new Error('Failed to register RFIDs.'));
      const res = await request(app).post('/antennas/0/rfids').send({ rfids: ['rfid1'] });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to register RFIDs.' });
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder = { rfidId: 'rfid1', startDate: '2023-01-01', status: 1, enCoursId: 1, workshopId: 1 };
      prisma.order.create.mockResolvedValue(newOrder);
      const res = await request(app).post('/orders').send(newOrder);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(newOrder);
    });

    it('should handle errors', async () => {
      prisma.order.create.mockRejectedValue(new Error('Failed to create order.'));
      const res = await request(app).post('/orders').send({ rfidId: 'rfid1' });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to create order.' });
    });
  });

  describe('POST /supports', () => {
    it('should create a new support', async () => {
      const newSupport = { rfidId: 'rfid1', type: 'type 1', artisan: 'artisan1' };
      prisma.support.create.mockResolvedValue(newSupport);
      const res = await request(app).post('/supports').send(newSupport);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(newSupport);
    });

    it('should handle errors', async () => {
      prisma.support.create.mockRejectedValue(new Error('Failed to create support.'));
      const res = await request(app).post('/supports').send({ rfidId: 'rfid1' });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Failed to create support.' });
    });
  });
});