import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet
  } from '@react-pdf/renderer';
  import { Eleve, Ecole } from '../lib/type';
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      fontSize: 8,
      width: 340,
      height: 210,
      padding: 5,
    },
    header: {
      textAlign: 'center',
      marginBottom: 4,
      fontWeight: 'bold',
    },
    ecole: {
      backgroundColor: '#2563EB',
      color: '#ffffff',
      textAlign: 'center',
      padding: 3,
      fontWeight: 'bold',
    },
    section: {
      flexDirection: 'row',
      marginTop: 4,
    },
    photo: {
      width: 60,
      height: 80,
      border: '1 solid #000',
    },
    infos: {
      marginLeft: 8,
      flexGrow: 1,
    },
    infoLine: {
      marginBottom: 2,
    },
    footer: {
      position: 'absolute',
      bottom: 5,
      left: 5,
      fontSize: 6,
      color: '#444',
    },
    qr: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      width: 40,
      height: 40,
    },
  });
  
  interface Props {
    eleve: Eleve;
    ecole: Ecole;
    photoUrl: string;
    qrCodeUrl: string;
  }
  
  export default function CartePdf({ eleve, ecole, photoUrl, qrCodeUrl }: Props) {
    return (
      <Document>
        <Page size={{ width: 340, height: 210 }} style={styles.page}>
          <View style={styles.header}>
            <Text>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</Text>
            <Text>MINISTÈRE DE L’ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE</Text>
          </View>
  
          <View style={styles.ecole}>
            <Text>{ecole.nom}</Text>
          </View>
  
          <Text style={{ textAlign: 'center', marginTop: 2, color: '#2563EB' }}>
            Carte Élève 2025-2026
          </Text>
  
          <View style={styles.section}>
            <Image style={styles.photo} src={photoUrl} />
            <View style={styles.infos}>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Nom:</Text> {eleve.nom_elev}</Text>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Postnom:</Text> {eleve.postnom_elev}</Text>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Prénom:</Text> {eleve.prenom_elev}</Text>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Sexe:</Text> {eleve.sexe}</Text>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Adresse:</Text> {eleve.adresses}</Text>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Classe:</Text> {eleve.classe_elev}</Text>
              <Text style={styles.infoLine}><Text style={{ fontWeight: 'bold' }}>Option:</Text> {eleve.option_elev}</Text>
            </View>
          </View>
  
          <View style={styles.footer}>
            <Text>{ecole.nom}</Text>
            <Text>{ecole.adresse}</Text>
            {ecole.telephone && <Text>📞 {ecole.telephone}</Text>}
          </View>
  
          <Image style={styles.qr} src={qrCodeUrl} />
        </Page>
      </Document>
    );
  }
  