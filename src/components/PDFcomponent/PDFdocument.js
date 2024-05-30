import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: '100%',
    border: '1px solid #000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    border: '1px solid #000',
    width: 'auto',
    fontSize: 8,
    textAlign: 'center',
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #000',
    fontWeight: 'normal',
    width: 'auto',
  },
});


const PDFDocument = ({ students, specialScoreNames, courseId }) => {
   const calculateHeaderWidth = (header) => {
    let width;
    switch (header) {
      case 'RB':
        width = '3%'; break;
      case 'Ime i prezime':
        width = '9%'; break;
      case 'Osnovna škola':
        width = '9%'; break;
      case 'SV-I':
        width = '4%'; break;
      case 'SV-II':
        width = '4%'; break;
      case 'SV-III':
        width = '4%'; break;
      case 'O':
        width = '4%'; break;
      case 'K':
        width = '4%'; break;
      case 'F':
        width = '4%'; break;
      case 'Ukupno':
        width = '5%'; break;
      default:
        width = '5%'; break;
    }
    return width;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', fontSize: 12}}>JU TEHNICKA SKOLA ZENICA</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2}}>Smjer: {courseId}</Text>
          <View style={styles.table}>
          <View style={styles.tableRow}>
            {/* 1st header cells */}
              <Text style={[styles.tableCell, styles.headerCell, { width: '21%' }]} colSpan={3}>Generalije</Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: '24%' }]} colSpan={5}>I-Opšti kriterij - Uzima se USPJEH od VI do IX razreda O.Š. zatim se sabere i pomnoži sa 3. (max: 60)</Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: '34%' }]} colSpan={7}>II-Posebni kriterij - Uzimaju se relevantni nastavni predmeti iz završnih razreda VIII i IX i saberu. (max: 30)</Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: '21%' }]} colSpan={4}>III-Specijalni kriterij - Uzimaju se bodovi iz takmicenja za VIII i IX razred i saberu. (ovo su dodatni bodovi)</Text>
            </View>
            <View style={styles.tableRow}>
              {/* 2nd header cells */}
              {['RB', 'Ime i prezime', 'Osnovna škola', ...(students[0]?.averageScores ? Object.keys(students[0]?.averageScores) : []), 'SV-I', ...specialScoreNames, 'SV-II', 'O', 'K', 'F', 'SV-III', 'Ukupno'].map((header, index) => (
                <Text key={index} style={[styles.tableCell, styles.headerCell, { width: calculateHeaderWidth(header) }]}>{header}</Text>
              ))}
            </View>
            {/* Rows for each student */}
            {students.map((student, studentIndex) => (
              <View key={studentIndex} style={styles.tableRow}>
                {/* Cells for each student data */}
                <Text style={[styles.tableCell, { width: '3%' }]}>{`${studentIndex + 1}`}</Text>
                <Text style={[styles.tableCell, { width: '9%' }]}>{`${student.last_name || ''} ${student.name || ''} ${student.status !== 'regular' ? '*' : ''}`}</Text>
                <Text style={[styles.tableCell, { width: '9%' }]}>{student.primary_school || ''}</Text>
                {/* Average scores */}
                {Object.values(student?.averageScores || {}).map((average, index) => (
                  <Text key={index} style={[styles.tableCell, { width: '5%' }]}>{average}</Text> //20 24
                ))}
                {/* SV (Opšti kriterij) */}
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv || '0'}</Text>
                {/* Special score names */}
                {specialScoreNames.map((specialScore, index) => (
                  <Text key={index} style={[styles.tableCell, { width: '5%' }]}>{student.specialScores[specialScore] || '0'}</Text> //30 18
                ))}
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv2 || '0'}</Text>
                {/* O, K, F */}
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.acknowledgmentPoints['O'] || '0'}</Text>
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.acknowledgmentPoints['K'] || '0'}</Text>
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.acknowledgmentPoints['F'] || '0'}</Text>
                {/* SV (specijalni kriterij) */}
                <Text style={[styles.tableCell, { width: '4%' }]}>{student.sv3 || '0'}</Text>
                {/* Total */}
                <Text style={[styles.tableCell, { width: '5%' }]}>{student.total || '0'}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};


export default PDFDocument;
