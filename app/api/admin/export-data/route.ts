import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { stringify } from 'csv-stringify/sync';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    // Fetch collections
    const workersCollection = db.collection('health_workers');
    const patientsCollection = db.collection('users');
    const alertsCollection = db.collection('alerts');
    const villagesCollection = db.collection('villages');

    // Get all data
    const workers = await workersCollection
      .find({})
      .project({ password: 0, __v: 0 })
      .toArray();

    const patients = await patientsCollection
      .find({ role: 'patient' })
      .project({ password: 0, __v: 0 })
      .toArray();

    const alerts = await alertsCollection
      .find({})
      .project({ __v: 0 })
      .toArray();

    const villages = await villagesCollection
      .find({})
      .project({ __v: 0 })
      .toArray();

    // Prepare CSV data with headers
    const csvParts: string[] = [];

    // Workers CSV
    csvParts.push('HEALTH WORKERS DATA');
    csvParts.push('');
    
    const workerHeaders = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Qualification', 'Village', 'Registration Number'];
    const workersData = workers.map((w: any) => [
      w._id?.toString() || '',
      w.name || '',
      w.email || '',
      w.phone || '',
      w.role || '',
      w.status || 'pending',
      w.qualification || '',
      w.village || '',
      w.registrationNumber || '',
    ]);

    csvParts.push(stringify([workerHeaders, ...workersData]));
    csvParts.push('');
    csvParts.push('');

    // Patients CSV
    csvParts.push('PATIENTS DATA');
    csvParts.push('');
    
    const patientHeaders = ['ID', 'Name', 'Email', 'Phone', 'Age', 'Gender', 'Village', 'Blood Group', 'Join Date'];
    const patientsData = patients.map((p: any) => [
      p._id?.toString() || '',
      p.name || '',
      p.email || '',
      p.phone || '',
      p.age || '',
      p.gender || '',
      p.village || '',
      p.bloodGroup || '',
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
    ]);

    csvParts.push(stringify([patientHeaders, ...patientsData]));
    csvParts.push('');
    csvParts.push('');

    // Alerts CSV
    csvParts.push('HEALTH ALERTS DATA');
    csvParts.push('');
    
    const alertHeaders = ['ID', 'Title', 'Description', 'Severity', 'Status', 'Date Created'];
    const alertsData = alerts.map((a: any) => [
      a._id?.toString() || '',
      a.title || '',
      a.description || '',
      a.severity || 'medium',
      a.status || 'active',
      a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '',
    ]);

    csvParts.push(stringify([alertHeaders, ...alertsData]));
    csvParts.push('');
    csvParts.push('');

    // Villages CSV
    csvParts.push('VILLAGES DATA');
    csvParts.push('');
    
    const villageHeaders = ['ID', 'Name', 'State', 'District', 'Population', 'Health Centers', 'Vaccination Coverage %'];
    const villagesData = villages.map((v: any) => [
      v._id?.toString() || '',
      v.name || '',
      v.state || '',
      v.district || '',
      v.population || '',
      v.healthCenters || '',
      v.coverage || '',
    ]);

    csvParts.push(stringify([villageHeaders, ...villagesData]));

    // Combine all CSV data
    const csvContent = csvParts.join('\n');
    const filename = `health-data-export-${new Date().toISOString().split('T')[0]}.csv`;

    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': Buffer.byteLength(csvContent).toString(),
      },
    });

    return response;
  } catch (error) {
    console.error('Export data error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
