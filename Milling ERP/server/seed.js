const db = require('./database');
const bcrypt = require('bcryptjs');

function tableIsEmpty(tableName) {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
  return row.count === 0;
}

function seed() {
  const seedTransaction = db.transaction(() => {
    // Seed batches if empty
    if (tableIsEmpty('batches')) {
      const batches = [
        {
          batch_number: 'B-2024-08-01',
          date: '2024-08-05',
          grain_type: 'Hard Red Wheat',
          input_mt: 120.0,
          output_mt: 90.6,
          extraction_rate: 75.5,
          ash_content: 0.55,
          moisture_pct: 13.4,
          protein_pct: 13.2,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Rahul Sharma',
          notes: 'Good color and texture.'
        },
        {
          batch_number: 'B-2024-08-02',
          date: '2024-08-12',
          grain_type: 'Soft White Wheat',
          input_mt: 100.0,
          output_mt: 73.0,
          extraction_rate: 73.0,
          ash_content: 0.50,
          moisture_pct: 13.0,
          protein_pct: 10.1,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Anita Rao',
          notes: 'Excellent baking performance.'
        },
        {
          batch_number: 'B-2024-08-03',
          date: '2024-08-20',
          grain_type: 'Durum Wheat',
          input_mt: 90.0,
          output_mt: 68.4,
          extraction_rate: 76.0,
          ash_content: 0.65,
          moisture_pct: 13.8,
          protein_pct: 13.8,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Mohammed Ali',
          notes: 'High protein for pasta flour.'
        },
        {
          batch_number: 'B-2024-09-01',
          date: '2024-09-03',
          grain_type: 'Whole Wheat',
          input_mt: 110.0,
          output_mt: 106.7,
          extraction_rate: 97.0,
          ash_content: 0.82,
          moisture_pct: 14.2,
          protein_pct: 12.2,
          grade: 'B',
          status: 'Review',
          operator_name: 'Kiran Patel',
          notes: 'Slightly higher moisture, monitor shelf life.'
        },
        {
          batch_number: 'B-2024-09-02',
          date: '2024-09-10',
          grain_type: 'Soft Red Wheat',
          input_mt: 95.0,
          output_mt: 70.3,
          extraction_rate: 74.0,
          ash_content: 0.60,
          moisture_pct: 13.2,
          protein_pct: 10.4,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Priya Singh',
          notes: 'Consistent particle size.'
        },
        {
          batch_number: 'B-2024-09-03',
          date: '2024-09-18',
          grain_type: 'Hard Red Wheat',
          input_mt: 130.0,
          output_mt: 97.5,
          extraction_rate: 75.0,
          ash_content: 0.58,
          moisture_pct: 13.7,
          protein_pct: 13.0,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Rahul Sharma',
          notes: 'Stable run, no stoppages.'
        },
        {
          batch_number: 'B-2024-10-01',
          date: '2024-10-02',
          grain_type: 'Soft White Wheat',
          input_mt: 105.0,
          output_mt: 77.2,
          extraction_rate: 73.5,
          ash_content: 0.48,
          moisture_pct: 13.1,
          protein_pct: 9.8,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Anita Rao',
          notes: 'Ideal for biscuits and cakes.'
        },
        {
          batch_number: 'B-2024-10-02',
          date: '2024-10-11',
          grain_type: 'Durum Wheat',
          input_mt: 92.0,
          output_mt: 69.4,
          extraction_rate: 75.4,
          ash_content: 0.70,
          moisture_pct: 13.9,
          protein_pct: 14.0,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Mohammed Ali',
          notes: 'Strong gluten, good for semolina.'
        },
        {
          batch_number: 'B-2024-10-03',
          date: '2024-10-21',
          grain_type: 'Whole Wheat',
          input_mt: 115.0,
          output_mt: 111.6,
          extraction_rate: 97.0,
          ash_content: 0.85,
          moisture_pct: 14.5,
          protein_pct: 12.8,
          grade: 'B',
          status: 'Review',
          operator_name: 'Kiran Patel',
          notes: 'Ash slightly above target, watch blend.'
        },
        {
          batch_number: 'B-2024-11-01',
          date: '2024-11-04',
          grain_type: 'Soft Red Wheat',
          input_mt: 98.0,
          output_mt: 72.5,
          extraction_rate: 74.0,
          ash_content: 0.62,
          moisture_pct: 13.3,
          protein_pct: 10.0,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Priya Singh',
          notes: 'Meets cookie flour specs.'
        },
        {
          batch_number: 'B-2024-11-02',
          date: '2024-11-15',
          grain_type: 'Hard Red Wheat',
          input_mt: 125.0,
          output_mt: 93.8,
          extraction_rate: 75.0,
          ash_content: 0.57,
          moisture_pct: 13.6,
          protein_pct: 12.9,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Rahul Sharma',
          notes: 'Smooth operation.'
        },
        {
          batch_number: 'B-2024-11-03',
          date: '2024-11-28',
          grain_type: 'Soft White Wheat',
          input_mt: 102.0,
          output_mt: 74.4,
          extraction_rate: 73.0,
          ash_content: 0.47,
          moisture_pct: 12.9,
          protein_pct: 9.5,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Anita Rao',
          notes: 'Low ash, premium quality.'
        },
        {
          batch_number: 'B-2024-12-01',
          date: '2024-12-06',
          grain_type: 'Durum Wheat',
          input_mt: 88.0,
          output_mt: 66.4,
          extraction_rate: 75.5,
          ash_content: 0.68,
          moisture_pct: 13.8,
          protein_pct: 13.5,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Mohammed Ali',
          notes: 'Yellow color within spec.'
        },
        {
          batch_number: 'B-2024-12-02',
          date: '2024-12-14',
          grain_type: 'Whole Wheat',
          input_mt: 112.0,
          output_mt: 108.6,
          extraction_rate: 97.0,
          ash_content: 0.80,
          moisture_pct: 14.0,
          protein_pct: 12.0,
          grade: 'B',
          status: 'Review',
          operator_name: 'Kiran Patel',
          notes: 'Slightly coarse grind requested.'
        },
        {
          batch_number: 'B-2024-12-03',
          date: '2024-12-22',
          grain_type: 'Soft Red Wheat',
          input_mt: 96.0,
          output_mt: 71.0,
          extraction_rate: 74.0,
          ash_content: 0.63,
          moisture_pct: 13.2,
          protein_pct: 10.2,
          grade: 'C',
          status: 'Failed',
          operator_name: 'Priya Singh',
          notes: 'Foreign matter detected, batch quarantined.'
        },
        {
          batch_number: 'B-2025-01-01',
          date: '2025-01-05',
          grain_type: 'Hard Red Wheat',
          input_mt: 128.0,
          output_mt: 96.0,
          extraction_rate: 75.0,
          ash_content: 0.56,
          moisture_pct: 13.5,
          protein_pct: 13.1,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Rahul Sharma',
          notes: 'New crop, stable performance.'
        },
        {
          batch_number: 'B-2025-01-02',
          date: '2025-01-14',
          grain_type: 'Soft White Wheat',
          input_mt: 104.0,
          output_mt: 76.0,
          extraction_rate: 73.1,
          ash_content: 0.49,
          moisture_pct: 12.8,
          protein_pct: 9.7,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Anita Rao',
          notes: 'Low moisture, good shelf life.'
        },
        {
          batch_number: 'B-2025-01-03',
          date: '2025-01-26',
          grain_type: 'Durum Wheat',
          input_mt: 91.0,
          output_mt: 68.3,
          extraction_rate: 75.0,
          ash_content: 0.69,
          moisture_pct: 13.9,
          protein_pct: 13.7,
          grade: 'B',
          status: 'Review',
          operator_name: 'Mohammed Ali',
          notes: 'Slight speck count increase, visual check.'
        },
        {
          batch_number: 'B-2025-02-01',
          date: '2025-02-07',
          grain_type: 'Whole Wheat',
          input_mt: 118.0,
          output_mt: 114.5,
          extraction_rate: 97.0,
          ash_content: 0.83,
          moisture_pct: 14.3,
          protein_pct: 12.5,
          grade: 'A',
          status: 'Passed',
          operator_name: 'Kiran Patel',
          notes: 'Customer requested higher fiber spec.'
        },
        {
          batch_number: 'B-2025-02-02',
          date: '2025-02-18',
          grain_type: 'Soft Red Wheat',
          input_mt: 97.0,
          output_mt: 71.8,
          extraction_rate: 74.0,
          ash_content: 0.64,
          moisture_pct: 13.3,
          protein_pct: 9.9,
          grade: 'C',
          status: 'Failed',
          operator_name: 'Priya Singh',
          notes: 'Moisture above spec, rejected for packing.'
        }
      ];

      const insertBatch = db.prepare(`
        INSERT INTO batches (
          batch_number, date, grain_type, input_mt, output_mt,
          extraction_rate, ash_content, moisture_pct, protein_pct,
          grade, status, operator_name, notes
        ) VALUES (
          @batch_number, @date, @grain_type, @input_mt, @output_mt,
          @extraction_rate, @ash_content, @moisture_pct, @protein_pct,
          @grade, @status, @operator_name, @notes
        )
      `);

      for (const batch of batches) {
        insertBatch.run(batch);
      }
    }

    // Seed procurement if empty
    if (tableIsEmpty('procurement')) {
      const procurement = [
        {
          grain_type: 'Hard Red Wheat',
          supplier_name: 'Prairie Grains Co.',
          target_mt: 3000,
          procured_mt: 2100,
          cost_per_mt: 285.0,
          lead_time_days: 18,
          order_date: '2025-04-05',
          expected_delivery: '2025-04-23',
          priority: 'High',
          status: 'In Progress',
          quarter: 'Q2 FY2025'
        },
        {
          grain_type: 'Soft White Wheat',
          supplier_name: 'Coastal Mills Ltd.',
          target_mt: 2000,
          procured_mt: 1800,
          cost_per_mt: 275.0,
          lead_time_days: 15,
          order_date: '2025-04-10',
          expected_delivery: '2025-04-25',
          priority: 'Normal',
          status: 'In Progress',
          quarter: 'Q2 FY2025'
        },
        {
          grain_type: 'Durum Wheat',
          supplier_name: 'Golden Fields Partners',
          target_mt: 1500,
          procured_mt: 1500,
          cost_per_mt: 320.0,
          lead_time_days: 20,
          order_date: '2025-04-02',
          expected_delivery: '2025-04-22',
          priority: 'High',
          status: 'Completed',
          quarter: 'Q2 FY2025'
        },
        {
          grain_type: 'Whole Wheat',
          supplier_name: 'Valley Agro Corp.',
          target_mt: 2500,
          procured_mt: 900,
          cost_per_mt: 295.0,
          lead_time_days: 16,
          order_date: '2025-04-15',
          expected_delivery: '2025-05-01',
          priority: 'High',
          status: 'Pending',
          quarter: 'Q2 FY2025'
        },
        {
          grain_type: 'Soft Red Wheat',
          supplier_name: 'Riverbend Grain Traders',
          target_mt: 1800,
          procured_mt: 600,
          cost_per_mt: 270.0,
          lead_time_days: 14,
          order_date: '2025-04-20',
          expected_delivery: '2025-05-04',
          priority: 'Normal',
          status: 'In Progress',
          quarter: 'Q2 FY2025'
        }
      ];

      const insertProcurement = db.prepare(`
        INSERT INTO procurement (
          grain_type, supplier_name, target_mt, procured_mt,
          cost_per_mt, lead_time_days, order_date, expected_delivery,
          priority, status, quarter
        ) VALUES (
          @grain_type, @supplier_name, @target_mt, @procured_mt,
          @cost_per_mt, @lead_time_days, @order_date, @expected_delivery,
          @priority, @status, @quarter
        )
      `);

      for (const p of procurement) {
        insertProcurement.run(p);
      }
    }

    // Seed silos if empty
    if (tableIsEmpty('silos')) {
      const silos = [
        { silo_name: 'Silo A', capacity_mt: 1000, current_mt: 750, grain_type: 'Hard Red Wheat' },
        { silo_name: 'Silo B', capacity_mt: 1000, current_mt: 620, grain_type: 'Soft White Wheat' },
        { silo_name: 'Silo C', capacity_mt: 1000, current_mt: 410, grain_type: 'Durum Wheat' },
        { silo_name: 'Silo D', capacity_mt: 1000, current_mt: 520, grain_type: 'Whole Wheat' },
        { silo_name: 'Silo E', capacity_mt: 1000, current_mt: 300, grain_type: 'Soft Red Wheat' }
      ];

      const insertSilo = db.prepare(`
        INSERT INTO silos (
          silo_name, capacity_mt, current_mt, grain_type
        ) VALUES (
          @silo_name, @capacity_mt, @current_mt, @grain_type
        )
      `);

      for (const silo of silos) {
        insertSilo.run(silo);
      }
    }

    // Seed admin user if users table empty
    if (tableIsEmpty('users')) {
      const passwordHash = bcrypt.hashSync('admin123', 10);

      const insertUser = db.prepare(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (@name, @email, @password_hash, @role)
      `);

      insertUser.run({
        name: 'System Administrator',
        email: 'admin@millops.com',
        password_hash: passwordHash,
        role: 'admin'
      });
    }
  });

  seedTransaction();
}

if (require.main === module) {
  try {
    seed();
    console.log('Database seeding completed (no changes made if tables already contained data).');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exitCode = 1;
  }
}

module.exports = seed;