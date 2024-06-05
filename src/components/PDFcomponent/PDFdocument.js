import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  section: {
    marginBottom: 5,
  },
  table: {
    width: '100%',
    border: '1px solid #000',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 3,
    border: '1px solid #000',
    width: 'auto',
    fontSize: 6,
    textAlign: 'center',
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #000',
    fontWeight: 'normal',
    width: 'auto',
  },
  noBottomBorder: {
    borderBottom: 'none',
  },
  noTopBorder: {
    borderTop: 'none',
  },
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    textAlign: 'right',
    fontSize: 8,
  },
  signatureLine: {
    borderTop: '1px solid #000',
    marginTop: 5,
    paddingTop: 5,
  },
  nameText: {
    fontWeight: 'bold',
  },
  ugText: {
    color: 'red',
  },
});

const replaceSpecialCharacters = (str) => {
  return str.replace(/č/g, 'c').replace(/ć/g, 'c');
};

const PDFDocument = ({ students, specialScoreNames, courseId, fullCourseName }) => {
  const sanitizedCourseName = replaceSpecialCharacters(fullCourseName);

  const calculateHeaderWidth = (header) => {
    let width;
    switch (header) {
      case 'RB':
        width = '3%';
        break;
      case 'Ime i prezime':
        width = '16%';
        break;
      case 'Osnovna škola':
        width = '11%';
        break;
      case 'SV-I':
        width = '4%';
        break;
      case 'SV-II':
        width = '4%';
        break;
      case 'SV-III':
        width = '4%';
        break;
      case 'O':
        width = '3%';
        break;
      case 'K':
        width = '3%';
        break;
      case 'F':
        width = '3%';
        break;
      case 'Ukupno':
        width = '5%';
        break;
      case 'Strani jezik':
        width = '4%';
        break;
      default:
        width = '4%';
        break;
    }
    return width;
  };

  const unconditionalStudents = students.filter(student => student.status === 'unconditional');
  const generationBestStudents = students.filter(student => student.status === 'generation_best_student');
  const regularStudents = students.filter(student => student.status === 'regular');

  const maxAcceptedStudents = courseId === 'RTIA' ? 44 : 22;

  // Combine students with prioritization
  const acceptedStudents = [
    ...generationBestStudents,
    ...regularStudents.slice(0, maxAcceptedStudents - generationBestStudents.length),
    ...unconditionalStudents
  ];

  const remainingStudents = regularStudents.slice(maxAcceptedStudents - generationBestStudents.length);

  // Number of students on first page
  const numStudentsOnFirstPage = Math.min(28, acceptedStudents.length);

  // Split accepted students into pages
  const firstPageAcceptedStudents = acceptedStudents.slice(0, numStudentsOnFirstPage);
  const secondPageAcceptedStudents = acceptedStudents.slice(numStudentsOnFirstPage);

  // Split remaining students into pages for non-accepted students
  const numNonAcceptedPerPage = 28;
  const nonAcceptedStudentPages = [];
  for (let i = 0; i < remainingStudents.length; i += numNonAcceptedPerPage) {
    nonAcceptedStudentPages.push(remainingStudents.slice(i, i + numNonAcceptedPerPage));
  }

  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={{ textAlign: 'center' }}>Spisak primljenih ucenika u prvi(I) razred školske 2024/2025. godine</Text>
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>JU TEHNICKA SKOLA ZENICA</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>Smjer: {sanitizedCourseName}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.headerCell, { width: '30%' }]} colSpan={3}>Generalije</Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: '20%' }]} colSpan={5}>I-Opšti kriterij - Uzima se USPJEH od VI do IX razreda O.Š. zatim se sabere i pomnoži sa 3. (max: 60)</Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: '28%' }]} colSpan={7}>II-Posebni kriterij - Uzimaju se relevantni nastavni predmeti iz završnih razreda VIII i IX i saberu. (max: 30)</Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: '13%' }]} colSpan={4}>III-Specijalni kriterij - Bodovi iz takmičenja.</Text>
              <Text style={[styles.tableCell, styles.headerCell, styles.noBottomBorder, { width: '5%', marginBottom: 0 }]} colSpan={1}></Text>
              <Text style={[styles.tableCell, styles.headerCell, styles.noBottomBorder, { width: '4%', marginBottom: 0 }]} colSpan={1}></Text>
            </View>
            <View style={styles.tableRow}>
              {['RB', 'Ime i prezime', 'Osnovna škola', ...(students[0]?.averageScores ? Object.keys(students[0]?.averageScores) : []), 'SV-I', ...specialScoreNames, 'SV-II', 'O', 'K', 'F', 'SV-III', 'Ukupno', 'Strani jezik'].map((header, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tableCell,
                    styles.headerCell,
                    { width: calculateHeaderWidth(header) },
                    (header === 'Ukupno' || header === 'Strani jezik') && styles.noTopBorder,
                  ]}
                >
                  {header}
                </Text>
              ))}
            </View>
            {firstPageAcceptedStudents.map((student, studentIndex) => (
              <View key={studentIndex} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '3%' }]}>{`${studentIndex + 1}`}</Text>
                <Text style={[styles.tableCell, { width: '16%', fontWeight: student.status === 'unconditional' ? 'bold' : 'normal' }]}>
                  {student.status === 'generation_best_student' && <Text style={styles.ugText}>(UG) </Text>}
                  {`${student.last_name || ''} ${student.name || ''}`}
                  {student.status === 'unconditional' && ' *'}
                </Text>
                <Text style={[styles.tableCell, { width: '11%' }]}>{student.primary_school || ''}</Text>
                {Object.values(student?.averageScores || {}).map((average, index) => (
                  <Text key={index} style={[styles.tableCell, { width: '4%' }]}>{average}</Text>
                ))}
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv || '0'}</Text>
                {specialScoreNames.map((specialScore, index) => (
                  <Text key={index} style={[styles.tableCell, { width: '4%' }]}>{student.specialScores[specialScore] || '0'}</Text>
                ))}
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv2 || '0'}</Text>
                <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['O'] || '0'}</Text>
                <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['K'] || '0'}</Text>
                <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['F'] || '0'}</Text>
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv3 || '0'}</Text>
                <Text style={[styles.tableCell, { width: '5%' }]}>{student.total || '0'}</Text>
                <Text style={[styles.tableCell, { width: '4%' }]}>{'E' || '0'}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.pageFooter}>
          <Text>DIREKTORICA:</Text>
          <Text>mr. sc. Maja Hadžisalihović, prof.</Text>
          <View style={{ ...styles.signatureLine, marginTop: 10 }} />
        </View>
      </Page>

      {/* Additional Pages for Accepted Students */}
      {secondPageAcceptedStudents.length > 0 && (
        <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Spisak primljenih ucenika u prvi(I) razred školske 2024/2025. godine</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 10 }}>JU TEHNICKA SKOLA ZENICA</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.headerCell, { width: '30%' }]} colSpan={3}>Generalije</Text>
                <Text style={[styles.tableCell, styles.headerCell, { width: '20%' }]} colSpan={5}>I-Opšti kriterij - Uzima se USPJEH od VI do IX razreda O.Š. zatim se sabere i pomnoži sa 3. (max: 60)</Text>
                <Text style={[styles.tableCell, styles.headerCell, { width: '28%' }]} colSpan={7}>II-Posebni kriterij - Uzimaju se relevantni nastavni predmeti iz završnih razreda VIII i IX i saberu. (max: 30)</Text>
                <Text style={[styles.tableCell, styles.headerCell, { width: '13%' }]} colSpan={4}>III-Specijalni kriterij - Bodovi iz takmičenja.</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.noBottomBorder, { width: '5%', marginBottom: 0 }]} colSpan={1}></Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.noBottomBorder, { width: '4%', marginBottom: 0 }]} colSpan={1}></Text>
              </View>
              <View style={styles.tableRow}>
                {['RB', 'Ime i prezime', 'Osnovna škola', ...(students[0]?.averageScores ? Object.keys(students[0]?.averageScores) : []), 'SV-I', ...specialScoreNames, 'SV-II', 'O', 'K', 'F', 'SV-III', 'Ukupno', 'Strani jezik'].map((header, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.tableCell,
                      styles.headerCell,
                      { width: calculateHeaderWidth(header) },
                      (header === 'Ukupno' || header === 'Strani jezik') && styles.noTopBorder,
                    ]}
                  >
                    {header}
                  </Text>
                ))}
              </View>
              {secondPageAcceptedStudents.map((student, studentIndex) => (
                <View key={studentIndex} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{`${numStudentsOnFirstPage + studentIndex + 1}`}</Text>
                  <Text style={[styles.tableCell, { width: '16%', fontWeight: student.status === 'unconditional' ? 'bold' : 'normal' }]}>
                    {student.status === 'generation_best_student' && <Text style={styles.ugText}>(UG) </Text>}
                    {`${student.last_name || ''} ${student.name || ''}`}
                    {student.status === 'unconditional' && ' *'}
                  </Text>
                  <Text style={[styles.tableCell, { width: '11%' }]}>{student.primary_school || ''}</Text>
                  {Object.values(student?.averageScores || {}).map((average, index) => (
                    <Text key={index} style={[styles.tableCell, { width: '4%' }]}>{average}</Text>
                  ))}
                  <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv || '0'}</Text>
                  {specialScoreNames.map((specialScore, index) => (
                    <Text key={index} style={[styles.tableCell, { width: '4%' }]}>{student.specialScores[specialScore] || '0'}</Text>
                  ))}
                  <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv2 || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['O'] || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['K'] || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['F'] || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv3 || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{student.total || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '4%' }]}>{'E' || '0'}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.pageFooter}>
            <Text>DIREKTORICA:</Text>
            <Text>mr. sc. Maja Hadžisalihovic, prof.</Text>
            <View style={{ ...styles.signatureLine, marginTop: 10 }} />
          </View>
        </Page>
      )}

      {/* Pages for Non-Accepted Students */}
      {nonAcceptedStudentPages.map((page, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} orientation="landscape">
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 10 }}>Spisak ucenika koji nisu primljeni u strucno zvanje {sanitizedCourseName}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.headerCell, { width: '30%' }]} colSpan={3}>Generalije</Text>
                <Text style={[styles.tableCell, styles.headerCell, { width: '20%' }]} colSpan={5}>I-Opšti kriterij - Uzima se USPJEH od VI do IX razreda O.Š. zatim se sabere i pomnoži sa 3. (max: 60)</Text>
                <Text style={[styles.tableCell, styles.headerCell, { width: '28%' }]} colSpan={7}>II-Posebni kriterij - Uzimaju se relevantni nastavni predmeti iz završnih razreda VIII i IX i saberu. (max: 30)</Text>
                <Text style={[styles.tableCell, styles.headerCell, { width: '13%' }]} colSpan={4}>III-Specijalni kriterij - Bodovi iz takmičenja.</Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.noBottomBorder, { width: '5%', marginBottom: 0 }]} colSpan={1}></Text>
                <Text style={[styles.tableCell, styles.headerCell, styles.noBottomBorder, { width: '4%', marginBottom: 0 }]} colSpan={1}></Text>
              </View>
              <View style={styles.tableRow}>
                {['RB', 'Ime i prezime', 'Osnovna škola', ...(students[0]?.averageScores ? Object.keys(students[0]?.averageScores) : []), 'SV-I', ...specialScoreNames, 'SV-II', 'O', 'K', 'F', 'SV-III', 'Ukupno', 'Strani jezik'].map((header, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.tableCell,
                      styles.headerCell,
                      { width: calculateHeaderWidth(header) },
                      (header === 'Ukupno' || header === 'Strani jezik') && styles.noTopBorder,
                    ]}
                  >
                    {header}
                  </Text>
                ))}
              </View>
              {page.map((student, studentIndex) => (
                <View key={studentIndex} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{`${numStudentsOnFirstPage + secondPageAcceptedStudents.length + pageIndex * numNonAcceptedPerPage + studentIndex + 1}`}</Text>
                  <Text style={[styles.tableCell, { width: '16%', fontWeight: student.status === 'unconditional' ? 'bold' : 'normal' }]}>
                    {student.status === 'generation_best_student' && <Text style={styles.ugText}>(UG) </Text>}
                    {`${student.last_name || ''} ${student.name || ''}`}
                    {student.status === 'unconditional' && ' *'}
                  </Text>
                  <Text style={[styles.tableCell, { width: '11%' }]}>{student.primary_school || ''}</Text>
                  {Object.values(student?.averageScores || {}).map((average, index) => (
                    <Text key={index} style={[styles.tableCell, { width: '4%' }]}>{average}</Text>
                  ))}
                  <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv || '0'}</Text>
                  {specialScoreNames.map((specialScore, index) => (
                    <Text key={index} style={[styles.tableCell, { width: '4%' }]}>{student.specialScores[specialScore] || '0'}</Text>
                  ))}
                  <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv2 || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['O'] || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['K'] || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '3%' }]}>{student.acknowledgmentPoints['F'] || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv3 || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{student.total || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '4%' }]}>{'E' || '0'}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.pageFooter}>
            <Text>DIREKTORICA:</Text>
            <Text>mr. sc. Maja Hadžisalihović, prof.</Text>
            <View style={{ ...styles.signatureLine, marginTop: 10 }} />
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDFDocument;
