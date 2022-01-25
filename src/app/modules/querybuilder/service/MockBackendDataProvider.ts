/* tslint:disable:variable-name */
import {
  CategoryEntry,
  TerminologyCode,
  TerminologyEntry,
} from '../model/api/terminology/terminology'
import { ValueDefinition, ValueType } from '../model/api/terminology/valuedefinition'
import { ObjectHelper } from '../controller/ObjectHelper'
import MDSKJSON from '../../../../assets/mock/MDSK.json'
import MDSBJSON from '../../../../assets/mock/MDSB.json'
import ADTJSON from '../../../../assets/mock/ADT.json'
import DiagnoseFHIR from '../../../../assets/mock/Diagnose.json'
import { FeatureService } from '../../../service/feature.service'

// noinspection JSMethodCanBeStatic
export class MockBackendDataProvider {
  private readonly categoryEntries: Array<CategoryEntry> = []
  private readonly categoryA = {
    shortDisplay: 'A',
    display: 'Anamnesis / Risk factors',
    catId: '1',
  }
  private readonly categoryD = { shortDisplay: 'D', display: 'Demographics', catId: '2' }
  private readonly categoryL = { shortDisplay: 'L', display: 'Laboratory values', catId: '3' }
  private readonly categoryT = { shortDisplay: 'T', display: 'Therapie', catId: '4' }
  private readonly categoryV = { shortDisplay: 'V', display: 'Vital signs', catId: '5' }
  private readonly categoryO = { shortDisplay: 'O', display: 'Other', catId: '6' }
  private readonly categoryE = { shortDisplay: 'E', display: 'Tumorentität', catId: '7' }
  private readonly categoryK = { shortDisplay: 'K', display: 'MDS-K (Klinische Daten)', catId: '8' }
  private readonly categoryB = {
    shortDisplay: 'B',
    display: 'MDS-B (Biomaterial-Daten)',
    catId: '9',
  }
  private readonly categoryAD = { shortDisplay: 'A', display: 'ADT', catId: '10' }
  private readonly categoryDi = { shortDisplay: 'Di', display: 'Diagnose', catId: '11' }

  private readonly mapDisplay = new Map<[string, string], TerminologyEntry>()
  private readonly mapCode = new Map<[string, string], TerminologyEntry>()
  private readonly mapId = new Map<string, TerminologyEntry>()

  private readonly _rootAnamnesis = this.createRootTermEntry(
    '1',
    'A',
    'Anamnesis / Risk factors',
    false,
    false
  )
  private readonly _childA1 = this.createRootTermEntry(
    'A1',
    'A1',
    'Chronic lung diseases',
    false,
    false
  )
  private readonly _childA1_1 = this.createTermEntry(
    'A1_1',
    'G47.3',
    'Schlafapnoe',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_2 = this.createTermEntry(
    'A1_2',
    'G47.31',
    'Obstruktives Schlafapnoe-Syndrom',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_3 = this.createTermEntry(
    'A1_3',
    'E66.29',
    'Übermäßige Adipositas mit alveolärer Hypoventilation : Grad oder Ausmaß der Adipositas nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_4 = this.createTermEntry(
    'A1_4',
    'I27.0',
    'Primäre pulmonale Hypertonie',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_5 = this.createTermEntry(
    'A1_5',
    'J84.1',
    'Sonstige interstitielle Lungenkrankheiten mit Fibrose',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_6 = this.createTermEntry(
    'A1_6',
    'A16.2',
    'Lungentuberkulose ohne Angabe einer bakteriologischen, molekularbiologischen oder histologischen Sicherung',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_7 = this.createTermEntry(
    'A1_7',
    'J60',
    'Kohlenbergarbeiter-Pneumokoniose',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_8 = this.createTermEntry(
    'A1_8',
    'J61',
    'Pneumokoniose durch Asbest und sonstige anorganische Fasern',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_9 = this.createTermEntry(
    'A1_9',
    'J64',
    'Nicht näher bezeichnete Pneumokoniose',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_10 = this.createTermEntry(
    'A1_10',
    'J66.0',
    'Krankheit der Atemwege durch spezifischen organischen Staub',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_11 = this.createTermEntry(
    'A1_11',
    'J67.0',
    'Farmerlunge',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_12 = this.createTermEntry(
    'A1_12',
    'J67.1',
    'Bagassose',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_13 = this.createTermEntry(
    'A1_13',
    'J68.4',
    'Chronische Krankheiten der Atmungsorgane durch chemische Substanzen, Gase, Rauch und Dämpfe',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_14 = this.createTermEntry(
    'A1_14',
    'J70.1',
    'Chronische und sonstige Lungenbeteiligung bei Strahleneinwirkung',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_15 = this.createTermEntry(
    'A1_15',
    'J70.4',
    'Arzneimittelinduzierte interstitielle Lungenkrankheit, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_16 = this.createTermEntry(
    'A1_16',
    'P27.8',
    'Sonstige chronische Atemwegskrankheiten mit Ursprung in der Perinatalperiode',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_17 = this.createTermEntry(
    'A1_17',
    'Z87.0',
    'Krankheiten des Atmungssystems in der Eigenanamnese',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_18 = this.createTermEntry(
    'A1_18',
    'J44.9',
    'Chronische obstruktive Lungenkrankheit, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_19 = this.createTermEntry(
    'A1_19',
    'J45.9',
    'Asthma bronchiale, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA1_20 = this.createTermEntry(
    'A1_20',
    'E84.9',
    'Zystische Fibrose, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2 = this.createRootTermEntry(
    'A2',
    'A2',
    'Disorders of cardiovascular system',
    false,
    false
  )
  private readonly _childA2_1 = this.createTermEntry(
    'A2_1',
    'I25.29',
    'Alter Myokardinfarkt Nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_2 = this.createTermEntry(
    'A2_2',
    'I10.90',
    'Essentielle Hypertonie, nicht näher bezeichnet : Ohne Angabe einer hypertensiven Krise',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_3 = this.createTermEntry(
    'A2_3',
    'I73.9',
    'Periphere Gefäßkrankheit, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_4 = this.createTermEntry(
    'A2_4',
    'I49.9',
    'Kardiale Arrhythmie, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_5 = this.createTermEntry(
    'A2_5',
    'I50.9',
    'Herzinsuffizienz, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_6 = this.createTermEntry(
    'A2_6',
    'I25.1',
    'Atherosklerotische Herzkrankheit',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_7 = this.createTermEntry(
    'A2_7',
    'I65.2',
    'Verschluss und Stenose der A. carotis',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_8 = this.createTermEntry(
    'A2_8',
    'Z95.1',
    'Vorhandensein eines aortokoronaren Bypasses',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_9 = this.createTermEntry(
    'A2_9',
    'Z95.5',
    'Vorhandensein eines Implantates oder Transplantates nach koronarer Gefäßplastik',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10 = this.createTermEntry(
    'A2_10',
    'I*',
    'Krankheiten des Kreislaufsystems',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1 = this.createTermEntry(
    'A2_10_1',
    'I00-I02',
    'Akutes rheumatisches Fieber',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_2 = this.createTermEntry(
    'A2_10_2',
    'I03-I09',
    'Chronische rheumatische Herzkrankheiten',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_3 = this.createTermEntry(
    'A2_10_3',
    'I10-I15',
    'Hypertonie [Hochdruckkrankheit]',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_4 = this.createTermEntry(
    'A2_10_4',
    'I20-I25',
    'Ischämische HerzkrankheitenI26-I28 Pulmonale Herzkrankheit und Krankheiten des Lungenkreislaufes',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_5 = this.createTermEntry(
    'A2_10_5',
    'I26-I28',
    'Pulmonale Herzkrankheit und Krankheiten des LungenkreislaufesI30-I52 Sonstige Formen der Herzkrankheit',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_6 = this.createTermEntry(
    'A2_10_6',
    'I30-I52',
    'Sonstige Formen der HerzkrankheitI60-I69 Zerebrovaskuläre Krankheiten',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_7 = this.createTermEntry(
    'A2_10_7',
    'I60-I69',
    'Zerebrovaskuläre KrankheitenI70-I79 Krankheiten der Arterien, Arteriolen und Kapillaren',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_8 = this.createTermEntry(
    'A2_10_8',
    'I70-I79',
    'Krankheiten der Arterien, Arteriolen und KapillarenI80-I89 Krankheiten der Venen, der Lymphgefäße und der Lymphknoten, anderenorts nicht klassifiziert',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_9 = this.createTermEntry(
    'A2_10_9',
    'I80-I89',
    'Krankheiten der Venen, der Lymphgefäße und der Lymphknoten, anderenorts nicht klassifiziertI95-I99 Sonstige und nicht näher bezeichnete Krankheiten des Kreislaufsystems',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_10 = this.createTermEntry(
    'A2_10_10',
    'I95-I99',
    'Sonstige und nicht näher bezeichnete Krankheiten des KreislaufsystemsICD I95-I99 Sonstige und nicht näher bezeichnete Krankheiten des Kreislaufsystems',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_1 = this.createTermEntry(
    'A2_10_1_1',
    'I00',
    'Rheumatisches Fieber ohne Angabe einer Herzbeteiligung',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_2 = this.createTermEntry(
    'A2_10_1_2',
    'I01',
    'Rheumatisches Fieber mit Herzbeteiligung',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_3 = this.createTermEntry(
    'A2_10_1_3',
    'I02',
    'Rheumatische Chorea',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_2_1 = this.createTermEntry(
    'A2_10_1_2_1',
    'I01.0',
    'Akute rheumatische Perikarditis',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_2_2 = this.createTermEntry(
    'A2_10_1_2_2',
    'I01.1',
    'Akute rheumatische Endokarditis',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_2_3 = this.createTermEntry(
    'A2_10_1_2_3',
    'I01.2',
    'Akute rheumatische Myokarditis',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_2_4 = this.createTermEntry(
    'A2_10_1_2_4',
    'I01.8',
    'Sonstige akute rheumatische Herzkrankheit',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_2_5 = this.createTermEntry(
    'A2_10_1_2_5',
    'I01.9',
    'Akute rheumatische Herzkrankheit, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_3_1 = this.createTermEntry(
    'A2_10_1_3_1',
    'I02.0',
    'Rheumatische Chorea mit Herzbeteiligung',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA2_10_1_3_2 = this.createTermEntry(
    'A2_10_1_3_2',
    'I02.9',
    'Rheumatische Chorea ohne Herzbeteiligung',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )

  private readonly _childA3_WithoutChildren = this.createRootTermEntry(
    'A3',
    'A3',
    'Chronic liver diseases',
    false,
    false
  )
  private readonly _childA3 = this.createRootTermEntry(
    'A3',
    'A3',
    'Chronic liver diseases',
    false,
    false
  )
  private readonly _childA3_1 = this.createTermEntry(
    'A3_1',
    'K76.0',
    'Fettleber [fettige Degeneration], anderenorts nicht klassifiziert',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA3_2 = this.createTermEntry(
    'A3_2',
    'K70.0',
    'Alkoholische Fettleber',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA3_3 = this.createTermEntry(
    'A3_3',
    'K74.6',
    'Fibrose und Zirrhose der Leber',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA3_4 = this.createTermEntry(
    'A3_4',
    'B18.9',
    'Chronische Virushepatitis, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )
  private readonly _childA3_5 = this.createTermEntry(
    'A3_5',
    'K76.9',
    'Leberkrankheit, nicht näher bezeichnet',
    'http://fhir.de/CodeSystem/dimdi/icd-10-gm'
  )

  private readonly _rootDemographics = this.createRootTermEntry(
    '2',
    'D',
    'Demographics',
    false,
    false
  )
  private readonly _childD1 = this.createTermEntry(
    'D1',
    '82810-3',
    'Pregnancy status',
    'http://loinc.org',
    this.createDefaultValueDefinitionConcept([
      this.createTermCode('LA15173-0', 'http://loinc.org', 'Pregnant'),
      this.createTermCode('LA26683-5', 'http://loinc.org', 'Not pregnant'),
      this.createTermCode('LA4489-6', 'http://loinc.org', 'Unknown'),
    ])
  )
  private readonly _childD2 = this.createTermEntry(
    'D2',
    '76689-9',
    'Biological Sex',
    'http://loinc.org',
    this.createDefaultValueDefinitionConcept([
      this.createTermCode('male', 'http://hl7.org/fhir/administrative-gender', 'Male'),
      this.createTermCode('female', 'http://hl7.org/fhir/administrative-gender', 'Female'),
      this.createTermCode('unknown', 'http://hl7.org/fhir/administrative-gender', 'Unknown'),
      this.createTermCode('X', 'http://fhir.de/CodeSystem/gender-amtlich-de', 'unbestimmt'),
      this.createTermCode('D', 'http://fhir.de/CodeSystem/gender-amtlich-de', 'divers'),
    ])
  )
  private readonly _childD3 = this.createTermEntry(
    'D3',
    '21612-7',
    'Age - Reported',
    'http://loinc.org',
    this.createDefaultValueDefinitionQuantity()
  )
  private readonly _childD4 = this.createTermEntry(
    'D4',
    '29463-7',
    'Body Weight',
    'http://loinc.org',
    this.createDefaultValueDefinitionQuantity()
  )
  private readonly _childD5 = this.createTermEntry(
    'D5',
    '8302-2',
    'Body Height',
    'http://loinc.org',
    this.createDefaultValueDefinitionQuantity()
  )
  private readonly _childD6 = this.createTermEntry(
    'D6',
    '82810-3',
    'Ethnic Group',
    'http://loinc.org',
    this.createDefaultValueDefinitionConcept([
      this.createTermCode('14045001', 'http://snomed.info/sct', 'Caucasian (ethnic group)'),
      this.createTermCode('18167009', 'http://snomed.info/sct', 'Black African (ethnic group)'),
      this.createTermCode(
        '315280000',
        'http://snomed.info/sct',
        'Asian - ethnic group (ethnic group)'
      ),
      this.createTermCode('90027003', 'http://snomed.info/sct', 'Arabs (ethnic group)'),
      this.createTermCode(
        '186019001',
        'http://snomed.info/sct',
        'Other ethnic, mixed origin (ethnic group)'
      ),
      this.createTermCode('2135-2', 'urn:oid:2.16.840.1.113883.6.238', 'Hispanic or Latino'),
    ])
  )
  private readonly _rootEntity = this.createRootTermEntry('7', 'E', 'Entities', false, false)
  private readonly _rootTumorEntity = this.createRootTermEntry(
    'TE',
    'TE',
    'Tumor Entities',
    false,
    false
  )
  private readonly _childE1 = this.createRootTermEntry('E1', 'E1', 'Gliom I', true, true)
  private readonly _childE1_D = this.createRootTermEntry('E1_D', 'E1_D', 'Diagnosen', false, false)
  private readonly _childE1_M = this.createRootTermEntry(
    'E1_M',
    'E1_M',
    'Morphologien',
    false,
    false
  )
  private readonly _childE1_D_1 = this.createTermEntry(
    'E1_D_1',
    '29:2',
    'Diagnose',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('D43', '', 'D43')])
  )
  private readonly _childE1_M_1 = this.createTermEntry(
    'E1_M_1',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9383/1', '', '9383/1')])
  )
  private readonly _childE1_M_2 = this.createTermEntry(
    'E1_M_2',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9384/1', '', '9384/1')])
  )
  private readonly _childE1_M_3 = this.createTermEntry(
    'E1_M_3',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9394/1', '', '9394/1')])
  )
  private readonly _childE1_M_4 = this.createTermEntry(
    'E1_M_4',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9421/1', '', '9421/1')])
  )

  private readonly _childE2 = this.createRootTermEntry('E2', 'E2', 'Gliom II', true, true)
  private readonly _childE2_D = this.createRootTermEntry('E2_D', 'E2_D', 'Diagnosen', false, false)
  private readonly _childE2_M = this.createRootTermEntry(
    'E2_M',
    'E2_M',
    'Morphologien',
    false,
    false
  )
  private readonly _childE2_D_1 = this.createTermEntry(
    'E2_D_1',
    '29:2',
    'Diagnose',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('C71', '', 'C71')])
  )
  private readonly _childE2_D_2 = this.createTermEntry(
    'E2_D_2',
    '29:2',
    'Diagnose',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('C72', '', 'C72')])
  )
  private readonly _childE2_M_1 = this.createTermEntry(
    'E2_M_1',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9382/3', '', '9382/3')])
  )
  private readonly _childE2_M_2 = this.createTermEntry(
    'E2_M_2',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9391/3', '', '9391/3')])
  )
  private readonly _childE2_M_3 = this.createTermEntry(
    'E2_M_3',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9400/3', '', '9400/3')])
  )
  private readonly _childE2_M_4 = this.createTermEntry(
    'E2_M_4',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9424/3', '', '9424/3')])
  )
  private readonly _childE2_M_5 = this.createTermEntry(
    'E2_M_5',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9425/3', '', '9425/3')])
  )
  private readonly _childE2_M_6 = this.createTermEntry(
    'E2_M_6',
    '7:2',
    'Morphologie',
    '',
    this.createDefaultValueDefinitionConcept([this.createTermCode('9450/3', '', '9450/3')])
  )

  private readonly _rootComponents = this.createRootTermEntry(
    '7_2',
    'E_C',
    'Components',
    false,
    false
  )
  private readonly _childE_C1 = this.createTermEntry(
    'E_C1',
    '29:2',
    'Diagnose',
    'http://loinc.org',
    this.createDefaultValueDefinitionConcept([
      this.createTermCode('D43', 'http://loinc.org', 'D43'),
      this.createTermCode('C71', 'http://loinc.org', 'C71'),
      this.createTermCode('C72', 'http://loinc.org', 'C72'),
    ])
  )
  private readonly _childE_C2 = this.createTermEntry(
    'E_C2',
    '7:2',
    'Morphologie',
    'http://loinc.org',
    this.createDefaultValueDefinitionConcept([
      this.createTermCode('9383/1', 'http://loinc.org', '9383/1'),
      this.createTermCode('9384/1', 'http://loinc.org', '9384/1'),
      this.createTermCode('9394/1', 'http://loinc.org', '9394/1'),
      this.createTermCode('9421/1', 'http://loinc.org', '9421/1'),
      this.createTermCode('9382/3', 'http://loinc.org', '9382/3'),
      this.createTermCode('9391/3', 'http://loinc.org', '9391/3'),
      this.createTermCode('9400/3', 'http://loinc.org', '9400/3'),
      this.createTermCode('9424/3', 'http://loinc.org', '9424/3'),
      this.createTermCode('9425/3', 'http://loinc.org', '9425/3'),
      this.createTermCode('9450/3', 'http://loinc.org', '9450/3'),
    ])
  )

  private initEntities(): void {
    this._rootEntity.children.push(this._rootTumorEntity)
    this._rootTumorEntity.children.push(this._childE1)
    this._childE1.children.push(this._childE1_D)
    this._childE1_D.children.push(this._childE1_D_1)
    this._childE1.children.push(this._childE1_M)
    this._childE1_M.children.push(this._childE1_M_1)
    this._childE1_M.children.push(this._childE1_M_2)
    this._childE1_M.children.push(this._childE1_M_3)
    this._childE1_M.children.push(this._childE1_M_4)

    this._rootTumorEntity.children.push(this._childE2)
    this._childE2.children.push(this._childE2_D)
    this._childE2_D.children.push(this._childE2_D_1)
    this._childE2_D.children.push(this._childE2_D_2)
    this._childE2.children.push(this._childE2_M)
    this._childE2_M.children.push(this._childE2_M_1)
    this._childE2_M.children.push(this._childE2_M_2)
    this._childE2_M.children.push(this._childE2_M_3)
    this._childE2_M.children.push(this._childE2_M_4)
    this._childE2_M.children.push(this._childE2_M_5)
    this._childE2_M.children.push(this._childE2_M_6)

    this._rootEntity.children.push(this._rootComponents)
    this._rootComponents.children.push(this._childE_C1)
    this._rootComponents.children.push(this._childE_C2)
  }

  private getTerminologyEntryEntity(): TerminologyEntry {
    return ObjectHelper.clone(this._rootEntity)
  }

  public getCategoryEntries(): Array<CategoryEntry> {
    return ObjectHelper.clone(this.categoryEntries)
  }

  public getTerminologyEntry(id: string): any {
    switch (id) {
      case '1':
        return this.getTerminologyEntryAmnesis()
      case 'A3':
        return this.getTerminologyEntryAmnesisLiver()
      case '2':
        return this.getTerminologyEntryDemographics()
      case '6':
        return this.getTerminologyEntryOther()
      case '7':
        return this.getTerminologyEntryEntity()
      case '8':
        return ObjectHelper.clone(MDSKJSON)
      case '9':
        return ObjectHelper.clone(MDSBJSON)
      case '10':
        return ObjectHelper.clone(ADTJSON)
      default:
        return this.getTerminologyEntryEmpty(id)
    }
  }

  private getTerminologyEntryEmpty(id: string): TerminologyEntry {
    return this.mapId.get(id)
      ? ObjectHelper.clone(this.mapId.get(id))
      : this.createRootTermEntry(id, '---', 'Not specified so far', false, false)
  }

  private getTerminologyEntryAmnesis(): TerminologyEntry {
    return ObjectHelper.clone(this._rootAnamnesis)
  }

  private getTerminologyEntryAmnesisLiver(): TerminologyEntry {
    return ObjectHelper.clone(this._childA3)
  }

  private getTerminologyEntryDemographics(): TerminologyEntry {
    return ObjectHelper.clone(this._rootDemographics)
  }

  public getTerminolgyEntrySearchResult(catId: string, search: string): Array<TerminologyEntry> {
    const result: Set<TerminologyEntry> = new Set<TerminologyEntry>()

    this.mapCode.forEach((termEntry, [keyCatId, keyCode]) => {
      if ((!catId || catId === keyCatId) && keyCode.toUpperCase().includes(search.toUpperCase())) {
        result.add(termEntry)
      }
    })
    this.mapDisplay.forEach((termEntry, [keyCatId, keyDisplay]) => {
      if (
        (!catId || catId === keyCatId) &&
        keyDisplay.toUpperCase().includes(search.toUpperCase())
      ) {
        result.add(termEntry)
      }
    })

    return Array.from(result)
  }

  constructor(private featureService: FeatureService) {
    this.initCategories(this.featureService.getDataset())
    this.initAmnesis()
    this.initAmnesisLiver()
    this.initDemographics()
    this.initEntities()
    this.initTermEntryMaps()
  }

  private initCategories(dataSet: string): void {
    if (dataSet === 'codex' || dataSet === 'all') {
      this.categoryEntries.push(this.categoryA)
      this.categoryEntries.push(this.categoryD)
      this.categoryEntries.push(this.categoryL)
      this.categoryEntries.push(this.categoryT)
      this.categoryEntries.push(this.categoryV)
      this.categoryEntries.push(this.categoryO)
    }
    if (dataSet === 'dktk' || dataSet === 'all') {
      this.categoryEntries.push(this.categoryE)
      this.categoryEntries.push(this.categoryK)
      this.categoryEntries.push(this.categoryB)
      this.categoryEntries.push(this.categoryAD)
      this.categoryEntries.push(this.categoryDi)
    }
  }

  private initAmnesis(): void {
    this._rootAnamnesis.children.push(this._childA1)

    this._childA1.children.push(this._childA1_1)
    this._childA1.children.push(this._childA1_2)
    this._childA1.children.push(this._childA1_3)
    this._childA1.children.push(this._childA1_4)
    this._childA1.children.push(this._childA1_5)
    this._childA1.children.push(this._childA1_6)
    this._childA1.children.push(this._childA1_7)
    this._childA1.children.push(this._childA1_8)
    this._childA1.children.push(this._childA1_9)
    this._childA1.children.push(this._childA1_10)
    this._childA1.children.push(this._childA1_11)
    this._childA1.children.push(this._childA1_12)
    this._childA1.children.push(this._childA1_13)
    this._childA1.children.push(this._childA1_14)
    this._childA1.children.push(this._childA1_15)
    this._childA1.children.push(this._childA1_16)
    this._childA1.children.push(this._childA1_17)
    this._childA1.children.push(this._childA1_18)
    this._childA1.children.push(this._childA1_19)
    this._childA1.children.push(this._childA1_20)

    this._rootAnamnesis.children.push(this._childA2)

    this._childA2.children.push(this._childA2_1)
    this._childA2.children.push(this._childA2_2)
    this._childA2.children.push(this._childA2_3)
    this._childA2.children.push(this._childA2_4)
    this._childA2.children.push(this._childA2_5)
    this._childA2.children.push(this._childA2_6)
    this._childA2.children.push(this._childA2_7)
    this._childA2.children.push(this._childA2_8)
    this._childA2.children.push(this._childA2_9)
    this._childA2.children.push(this._childA2_10)
    this.configureSlectableNonLeaf(this._childA2_10)
    this._childA2_10.children.push(this._childA2_10_1)
    this.configureSlectableNonLeaf(this._childA2_10_1)
    this._childA2_10.children.push(this._childA2_10_2)
    this.configureSlectableNonLeaf(this._childA2_10_2)
    this._childA2_10.children.push(this._childA2_10_3)
    this.configureSlectableNonLeaf(this._childA2_10_3)
    this._childA2_10.children.push(this._childA2_10_4)
    this.configureSlectableNonLeaf(this._childA2_10_4)
    this._childA2_10.children.push(this._childA2_10_5)
    this.configureSlectableNonLeaf(this._childA2_10_5)
    this._childA2_10.children.push(this._childA2_10_6)
    this.configureSlectableNonLeaf(this._childA2_10_6)
    this._childA2_10.children.push(this._childA2_10_7)
    this.configureSlectableNonLeaf(this._childA2_10_7)
    this._childA2_10.children.push(this._childA2_10_8)
    this.configureSlectableNonLeaf(this._childA2_10_8)
    this._childA2_10.children.push(this._childA2_10_9)
    this.configureSlectableNonLeaf(this._childA2_10_9)
    this._childA2_10.children.push(this._childA2_10_10)
    this.configureSlectableNonLeaf(this._childA2_10_10)

    this._childA2_10_1.children.push(this._childA2_10_1_1)
    this._childA2_10_1.children.push(this._childA2_10_1_2)
    this._childA2_10_1_2.leaf = false
    this._childA2_10_1.children.push(this._childA2_10_1_3)
    this._childA2_10_1_3.leaf = false

    this._childA2_10_1_2.children.push(this._childA2_10_1_2_1)
    this._childA2_10_1_2.children.push(this._childA2_10_1_2_2)
    this._childA2_10_1_2.children.push(this._childA2_10_1_2_3)
    this._childA2_10_1_2.children.push(this._childA2_10_1_2_4)
    this._childA2_10_1_2.children.push(this._childA2_10_1_2_5)

    this._childA2_10_1_3.children.push(this._childA2_10_1_3_1)
    this._childA2_10_1_3.children.push(this._childA2_10_1_3_2)

    this._rootAnamnesis.children.push(this._childA3_WithoutChildren)
  }

  private configureSlectableNonLeaf(termEntry: TerminologyEntry): void {
    termEntry.selectable = false
    termEntry.leaf = false
  }

  private initAmnesisLiver(): void {
    this._childA3.children.push(this._childA3_1)
    this._childA3.children.push(this._childA3_2)
    this._childA3.children.push(this._childA3_3)
    this._childA3.children.push(this._childA3_4)
    this._childA3.children.push(this._childA3_5)
  }

  private initDemographics(): void {
    this._childD1.valueDefinitions[0].display = 'Schwangerschaft'
    this._rootDemographics.children.push(this._childD1)
    this._rootDemographics.children.push(this._childD2)
    this._childD2.valueDefinitions[0].precision = 0
    this._rootDemographics.children.push(this._childD3)
    this._childD3.valueDefinitions[0].allowedUnits = [{ code: 'a', display: ' Jahre(e)' }]
    this._childD3.valueDefinitions[0].display = 'Alter'
    this._rootDemographics.children.push(this._childD4)
    this._childD4.valueDefinitions[0].allowedUnits = [{ code: 'kg', display: 'kg' }]
    this._rootDemographics.children.push(this._childD5)
    this._childD5.valueDefinitions[0].allowedUnits = [
      { code: 'cm', display: 'cm' },
      { code: 'm', display: 'm' },
    ]
    this._rootDemographics.children.push(this._childD6)
  }

  private initTermEntryMaps(): void {
    this.addToMaps(this.categoryA.catId, this._childA1)
    this.addToMaps(this.categoryA.catId, this._childA1_1)
    this.addToMaps(this.categoryA.catId, this._childA1_2)
    this.addToMaps(this.categoryA.catId, this._childA1_3)
    this.addToMaps(this.categoryA.catId, this._childA1_4)
    this.addToMaps(this.categoryA.catId, this._childA1_5)
    this.addToMaps(this.categoryA.catId, this._childA1_6)
    this.addToMaps(this.categoryA.catId, this._childA1_7)
    this.addToMaps(this.categoryA.catId, this._childA1_8)
    this.addToMaps(this.categoryA.catId, this._childA1_9)
    this.addToMaps(this.categoryA.catId, this._childA1_10)
    this.addToMaps(this.categoryA.catId, this._childA1_11)
    this.addToMaps(this.categoryA.catId, this._childA1_12)
    this.addToMaps(this.categoryA.catId, this._childA1_13)
    this.addToMaps(this.categoryA.catId, this._childA1_14)
    this.addToMaps(this.categoryA.catId, this._childA1_15)
    this.addToMaps(this.categoryA.catId, this._childA1_16)
    this.addToMaps(this.categoryA.catId, this._childA1_17)
    this.addToMaps(this.categoryA.catId, this._childA1_18)
    this.addToMaps(this.categoryA.catId, this._childA1_19)
    this.addToMaps(this.categoryA.catId, this._childA1_20)
    this.addToMaps(this.categoryA.catId, this._childA2)
    this.addToMaps(this.categoryA.catId, this._childA2_1)
    this.addToMaps(this.categoryA.catId, this._childA2_2)
    this.addToMaps(this.categoryA.catId, this._childA2_3)
    this.addToMaps(this.categoryA.catId, this._childA2_4)
    this.addToMaps(this.categoryA.catId, this._childA2_5)
    this.addToMaps(this.categoryA.catId, this._childA2_6)
    this.addToMaps(this.categoryA.catId, this._childA2_7)
    this.addToMaps(this.categoryA.catId, this._childA2_8)
    this.addToMaps(this.categoryA.catId, this._childA2_9)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_1)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_2)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_3)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_2_1)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_2_2)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_2_3)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_2_4)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_2_5)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_3_1)
    this.addToMaps(this.categoryA.catId, this._childA2_10_1_3_2)
    this.addToMaps(this.categoryA.catId, this._childA3)
    this.addToMaps(this.categoryA.catId, this._childA3_1)
    this.addToMaps(this.categoryA.catId, this._childA3_2)
    this.addToMaps(this.categoryA.catId, this._childA3_3)
    this.addToMaps(this.categoryA.catId, this._childA3_4)
    this.addToMaps(this.categoryA.catId, this._childA3_5)

    this.addToMaps(this.categoryD.catId, this._childD1)
    this.addToMaps(this.categoryD.catId, this._childD2)
    this.addToMaps(this.categoryD.catId, this._childD3)
    this.addToMaps(this.categoryD.catId, this._childD4)
    this.addToMaps(this.categoryD.catId, this._childD5)
    this.addToMaps(this.categoryD.catId, this._childD6)
  }

  private addToMaps(catId: string, termEntry: TerminologyEntry): void {
    if (!termEntry.selectable) {
      return
    }

    const termEntryWithoutChildren = ObjectHelper.clone(termEntry)
    termEntryWithoutChildren.children = []

    this.mapId.set(termEntry.id, termEntryWithoutChildren)
    this.mapCode.set([catId, termEntry.termCode.code], termEntryWithoutChildren)
    this.mapDisplay.set([catId, termEntry.display], termEntryWithoutChildren)
  }

  private createRootTermEntry(
    id: string,
    code: string,
    display: string,
    entity: boolean,
    selectable: boolean
  ): TerminologyEntry {
    const termEntry = new TerminologyEntry()
    termEntry.leaf = false
    termEntry.selectable = selectable
    termEntry.id = id
    termEntry.display = display
    termEntry.timeRestrictionAllowed = false
    termEntry.children = []
    termEntry.entity = entity
    termEntry.termCode = {
      code,
      system: '',
      display,
    }
    return termEntry
  }

  private createTermEntry(
    id: string,
    code: string,
    display: string,
    system = 'none',
    valueDefinition?: ValueDefinition
  ): TerminologyEntry {
    const termEntry = new TerminologyEntry()
    termEntry.leaf = true
    termEntry.selectable = true
    termEntry.id = id
    termEntry.display = display
    termEntry.timeRestrictionAllowed = true
    termEntry.children = []
    termEntry.entity = false
    termEntry.termCode = {
      code,
      system,
      display,
    }
    if (valueDefinition) {
      termEntry.valueDefinitions.push(valueDefinition)
    }
    return termEntry
  }

  private createDefaultValueDefinitionQuantity(): ValueDefinition {
    return {
      type: ValueType.QUANTITY,
      precision: 1,
      min: 0,
      max: 100,
      allowedUnits: [
        { code: 'l', display: 'Liter' },
        { code: 'l', display: 'Milliliter' },
      ],
    }
  }

  private createDefaultValueDefinitionConcept(
    selectableConcepts?: Array<TerminologyCode>
  ): ValueDefinition {
    return {
      type: ValueType.CONCEPT,
      precision: 0,
      selectableConcepts,
    }
  }

  private createTermCode(code: string, system: string, display: string): TerminologyCode {
    return { code, display, system }
  }

  private getTerminologyEntryOther(): TerminologyEntry {
    const valueDefinition1 = this.createDefaultValueDefinitionQuantity()
    valueDefinition1.display = 'Bewertungszahl'
    const valueDefinition2 = this.createDefaultValueDefinitionConcept([
      this.createTermCode('XYZ-0', 'http://test.org', 'first'),
      this.createTermCode('XYZ-5', 'http://test.org', 'second'),
      this.createTermCode('XYZ-6', 'http://test.org', 'last'),
    ])
    valueDefinition2.display = 'Position'
    return {
      id: '6',
      display: 'multiple value filters',
      timeRestrictionAllowed: true,
      selected: false,
      selectable: true,
      children: [],
      leaf: true,
      entity: false,
      termCode: {
        code: 'xyz',
        system: 'nonsense',
        display: 'multiple value filters',
      },
      valueDefinitions: [valueDefinition1, valueDefinition2],
    }
  }
}
