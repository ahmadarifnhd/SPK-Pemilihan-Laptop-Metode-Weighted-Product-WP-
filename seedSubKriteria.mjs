import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

let connStr = process.env.DIRECT_URL;
if (connStr && connStr.includes('#')) {
  connStr = connStr.replace('#LAPTOPKU2026', '%23LAPTOPKU2026');
}

const client = new Client({
  connectionString: connStr
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to DB. Seeding Sub Kriteria (laptop)...");

    const { rows: kriterias } = await client.query('SELECT * FROM public.kriterias ORDER BY kode');
    const kMap = {};
    kriterias.forEach(k => kMap[k.kode] = k);

    await client.query('DELETE FROM public.sub_kriterias');

    const subKriterias = [];

    if (kMap['C1']) {
      const kid = kMap['C1'].id;
      subKriterias.push(
        { kriteria_id: kid, by_kriteria: kMap['C1'].nama, sub_kriteria: '< 10 Juta', skor_sub_kriteria: 5, atribut: 'Cost' },
        { kriteria_id: kid, by_kriteria: kMap['C1'].nama, sub_kriteria: '10 - 15 Juta', skor_sub_kriteria: 4, atribut: 'Cost' },
        { kriteria_id: kid, by_kriteria: kMap['C1'].nama, sub_kriteria: '15 - 22 Juta', skor_sub_kriteria: 3, atribut: 'Cost' },
        { kriteria_id: kid, by_kriteria: kMap['C1'].nama, sub_kriteria: '22 - 30 Juta', skor_sub_kriteria: 2, atribut: 'Cost' },
        { kriteria_id: kid, by_kriteria: kMap['C1'].nama, sub_kriteria: '> 30 Juta', skor_sub_kriteria: 1, atribut: 'Cost' }
      );
    }

    if (kMap['C2']) {
      const kid = kMap['C2'].id;
      subKriterias.push(
        { kriteria_id: kid, by_kriteria: kMap['C2'].nama, sub_kriteria: '>= 32 GB', skor_sub_kriteria: 5, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C2'].nama, sub_kriteria: '24 - 31 GB', skor_sub_kriteria: 4, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C2'].nama, sub_kriteria: '16 - 23 GB', skor_sub_kriteria: 3, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C2'].nama, sub_kriteria: '8 - 15 GB', skor_sub_kriteria: 2, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C2'].nama, sub_kriteria: '< 8 GB', skor_sub_kriteria: 1, atribut: 'Benefit' }
      );
    }

    if (kMap['C3']) {
      const kid = kMap['C3'].id;
      subKriterias.push(
        { kriteria_id: kid, by_kriteria: kMap['C3'].nama, sub_kriteria: '>= 1000 GB', skor_sub_kriteria: 5, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C3'].nama, sub_kriteria: '512 - 999 GB', skor_sub_kriteria: 4, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C3'].nama, sub_kriteria: '256 - 511 GB', skor_sub_kriteria: 3, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C3'].nama, sub_kriteria: '128 - 255 GB', skor_sub_kriteria: 2, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C3'].nama, sub_kriteria: '< 128 GB', skor_sub_kriteria: 1, atribut: 'Benefit' }
      );
    }

    if (kMap['C4']) {
      const kid = kMap['C4'].id;
      subKriterias.push(
        { kriteria_id: kid, by_kriteria: kMap['C4'].nama, sub_kriteria: '> 2023', skor_sub_kriteria: 5, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C4'].nama, sub_kriteria: '2020 - 2023', skor_sub_kriteria: 4, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C4'].nama, sub_kriteria: '2017 - 2019', skor_sub_kriteria: 3, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C4'].nama, sub_kriteria: '2014 - 2016', skor_sub_kriteria: 2, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C4'].nama, sub_kriteria: '< 2014', skor_sub_kriteria: 1, atribut: 'Benefit' }
      );
    }

    if (kMap['C5']) {
      const kid = kMap['C5'].id;
      subKriterias.push(
        { kriteria_id: kid, by_kriteria: kMap['C5'].nama, sub_kriteria: '>= 17 inch', skor_sub_kriteria: 5, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C5'].nama, sub_kriteria: '15 - 16.9 inch', skor_sub_kriteria: 4, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C5'].nama, sub_kriteria: '14 - 14.9 inch', skor_sub_kriteria: 3, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C5'].nama, sub_kriteria: '13 - 13.9 inch', skor_sub_kriteria: 2, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C5'].nama, sub_kriteria: '< 13 inch', skor_sub_kriteria: 1, atribut: 'Benefit' }
      );
    }

    if (kMap['C6']) {
      const kid = kMap['C6'].id;
      subKriterias.push(
        { kriteria_id: kid, by_kriteria: kMap['C6'].nama, sub_kriteria: '>= 90', skor_sub_kriteria: 5, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C6'].nama, sub_kriteria: '80 - 89', skor_sub_kriteria: 4, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C6'].nama, sub_kriteria: '70 - 79', skor_sub_kriteria: 3, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C6'].nama, sub_kriteria: '60 - 69', skor_sub_kriteria: 2, atribut: 'Benefit' },
        { kriteria_id: kid, by_kriteria: kMap['C6'].nama, sub_kriteria: '< 60', skor_sub_kriteria: 1, atribut: 'Benefit' }
      );
    }

    for (const sk of subKriterias) {
      await client.query(
        'INSERT INTO public.sub_kriterias (kriteria_id, by_kriteria, sub_kriteria, skor_sub_kriteria, atribut) VALUES ($1, $2, $3, $4, $5)',
        [sk.kriteria_id, sk.by_kriteria, sk.sub_kriteria, sk.skor_sub_kriteria, sk.atribut]
      );
    }

    console.log(`Successfully seeded ${subKriterias.length} sub-criteria.`);
    await client.end();
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

main();
