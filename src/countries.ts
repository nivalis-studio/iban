import { Specification } from './specification';

export const COUNTRIES: { [key: string]: Specification } = {
  'AD': new Specification('AD', 24, 'F04F04A12', 'AD1200012030200359100100'),
  'AE': new Specification('AE', 23, 'F03F16', 'AE070331234567890123456'),
  'AL': new Specification('AL', 28, 'F08A16', 'AL47212110090000000235698741'),
  'AT': new Specification('AT', 20, 'F05F11', 'AT611904300234573201'),
  'AZ': new Specification('AZ', 28, 'U04A20', 'AZ21NABZ00000000137010001944'),
  'BA': new Specification('BA', 20, 'F03F03F08F02', 'BA391290079401028494'),
  'BE': new Specification('BE', 16, 'F03F07F02', 'BE68539007547034'),
  'BG': new Specification('BG', 22, 'U04F04F02A08', 'BG80BNBG96611020345678'),
  'BH': new Specification('BH', 22, 'U04A14', 'BH67BMAG00001299123456'),

  'BR': new Specification(
    'BR',
    29,
    'F08F05F10U01A01',
    'BR9700360305000010009795493P1',
  ),

  'BY': new Specification(
    'BY',
    28,
    'A04F04A16',
    'BY13NBRB3600900000002Z00AB00',
  ),
  'CH': new Specification('CH', 21, 'F05A12', 'CH9300762011623852957'),
  'CR': new Specification('CR', 22, 'F04F14', 'CR72012300000171549015'),

  'CY': new Specification(
    'CY',
    28,
    'F03F05A16',
    'CY17002001280000001200527600',
  ),

  'CZ': new Specification('CZ', 24, 'F04F06F10', 'CZ6508000000192000145399'),
  'DE': new Specification('DE', 22, 'F08F10', 'DE89370400440532013000'),
  'DK': new Specification('DK', 18, 'F04F09F01', 'DK5000400440116243'),
  'DO': new Specification('DO', 28, 'U04F20', 'DO28BAGR00000001212453611324'),
  'EE': new Specification('EE', 20, 'F02F02F11F01', 'EE382200221020145685'),

  'EG': new Specification(
    'EG',
    29,
    'F04F04F17',
    'EG800002000156789012345180002',
  ),

  'ES': new Specification(
    'ES',
    24,
    'F04F04F01F01F10',
    'ES9121000418450200051332',
  ),

  'FI': new Specification('FI', 18, 'F06F07F01', 'FI2112345600000785'),
  'FO': new Specification('FO', 18, 'F04F09F01', 'FO6264600001631634'),

  'FR': new Specification(
    'FR',
    27,
    'F05F05A11F02',
    'FR1420041010050500013M02606',
  ),

  'GB': new Specification('GB', 22, 'U04F06F08', 'GB29NWBK60161331926819'),
  'GE': new Specification('GE', 22, 'U02F16', 'GE29NB0000000101904917'),
  'GI': new Specification('GI', 23, 'U04A15', 'GI75NWBK000000007099453'),
  'GL': new Specification('GL', 18, 'F04F09F01', 'GL8964710001000206'),

  'GR': new Specification('GR', 27, 'F03F04A16', 'GR1601101250000000012300695'),

  'GT': new Specification('GT', 28, 'A04A20', 'GT82TRAJ01020000001210029690'),
  'HR': new Specification('HR', 21, 'F07F10', 'HR1210010051863000160'),

  'HU': new Specification(
    'HU',
    28,
    'F03F04F01F15F01',
    'HU42117730161111101800000000',
  ),

  'IE': new Specification('IE', 22, 'U04F06F08', 'IE29AIBK93115212345678'),
  'IL': new Specification('IL', 23, 'F03F03F13', 'IL620108000000099999999'),

  'IS': new Specification(
    'IS',
    26,
    'F04F02F06F10',
    'IS140159260076545510730339',
  ),

  'IT': new Specification(
    'IT',
    27,
    'U01F05F05A12',
    'IT60X0542811101000000123456',
  ),

  'IQ': new Specification('IQ', 23, 'U04F03A12', 'IQ98NBIQ850123456789012'),

  'JO': new Specification('JO', 30, 'A04F22', 'JO15AAAA1234567890123456789012'),

  'KW': new Specification('KW', 30, 'U04A22', 'KW81CBKU0000000000001234560101'),

  'KZ': new Specification('KZ', 20, 'F03A13', 'KZ86125KZT5004100100'),
  'LB': new Specification('LB', 28, 'F04A20', 'LB62099900000001001901229114'),

  'LC': new Specification(
    'LC',
    32,
    'U04F24',
    'LC07HEMM000100010012001200013015',
  ),

  'LI': new Specification('LI', 21, 'F05A12', 'LI21088100002324013AA'),
  'LT': new Specification('LT', 20, 'F05F11', 'LT121000011101001000'),
  'LU': new Specification('LU', 20, 'F03A13', 'LU280019400644750000'),

  'MC': new Specification(
    'MC',
    27,
    'F05F05A11F02',
    'MC5811222000010123456789030',
  ),

  'MD': new Specification('MD', 24, 'U02A18', 'MD24AG000225100013104168'),
  'ME': new Specification('ME', 22, 'F03F13F02', 'ME25505000012345678951'),
  'MK': new Specification('MK', 19, 'F03A10F02', 'MK07250120000058984'),

  'MR': new Specification(
    'MR',
    27,
    'F05F05F11F02',
    'MR1300020001010000123456753',
  ),

  'MT': new Specification(
    'MT',
    31,
    'U04F05A18',
    'MT84MALT011000012345MTLCAST001S',
  ),

  'MU': new Specification(
    'MU',
    30,
    'U04F02F02F12F03U03',
    'MU17BOMM0101101030300200000MUR',
  ),

  'NL': new Specification('NL', 18, 'U04F10', 'NL91ABNA0417164300'),
  'NO': new Specification('NO', 15, 'F04F06F01', 'NO9386011117947'),
  'PK': new Specification('PK', 24, 'U04A16', 'PK36SCBL0000001123456702'),
  'PL': new Specification('PL', 28, 'F08F16', 'PL61109010140000071219812874'),

  'PS': new Specification('PS', 29, 'U04A21', 'PS92PALS000000000400123456702'),

  'PT': new Specification(
    'PT',
    25,
    'F04F04F11F02',
    'PT50000201231234567890154',
  ),

  'QA': new Specification('QA', 29, 'U04A21', 'QA30AAAA123456789012345678901'),

  'RO': new Specification('RO', 24, 'U04A16', 'RO49AAAA1B31007593840000'),
  'RS': new Specification('RS', 22, 'F03F13F02', 'RS35260005601001611379'),
  'SA': new Specification('SA', 24, 'F02A18', 'SA0380000000608010167519'),

  'SC': new Specification(
    'SC',
    31,
    'U04F04F16U03',
    'SC18SSCB11010000000000001497USD',
  ),

  'SE': new Specification('SE', 24, 'F03F16F01', 'SE4550000000058398257466'),
  'SI': new Specification('SI', 19, 'F05F08F02', 'SI56263300012039086'),
  'SK': new Specification('SK', 24, 'F04F06F10', 'SK3112000000198742637541'),

  'SM': new Specification(
    'SM',
    27,
    'U01F05F05A12',
    'SM86U0322509800000000270100',
  ),

  'ST': new Specification('ST', 25, 'F08F11F02', 'ST68000100010051845310112'),
  'SV': new Specification('SV', 28, 'U04F20', 'SV62CENR00000000000000700025'),
  'TL': new Specification('TL', 23, 'F03F14F02', 'TL380080012345678910157'),

  'TN': new Specification('TN', 24, 'F02F03F13F02', 'TN5910006035183598478831'),

  'TR': new Specification('TR', 26, 'F05F01A16', 'TR330006100519786457841326'),

  'UA': new Specification('UA', 29, 'F25', 'UA511234567890123456789012345'),
  'VA': new Specification('VA', 22, 'F18', 'VA59001123000012345678'),
  'VG': new Specification('VG', 24, 'U04F16', 'VG96VPVG0000012345678901'),
  'XK': new Specification('XK', 20, 'F04F10F02', 'XK051212012345678906'),

  // The following countries are not included in the official IBAN registry but use the IBAN specification

  // Angola
  'AO': new Specification('AO', 25, 'F21', 'AO69123456789012345678901'),
  // Burkina
  'BF': new Specification('BF', 27, 'F23', 'BF2312345678901234567890123'),
  // Burundi
  'BI': new Specification('BI', 16, 'F12', 'BI41123456789012'),
  // Benin
  'BJ': new Specification('BJ', 28, 'F24', 'BJ39123456789012345678901234'),
  // Ivory
  'CI': new Specification('CI', 28, 'U02F22', 'CI70CI1234567890123456789012'),
  // Cameron
  'CM': new Specification('CM', 27, 'F23', 'CM9012345678901234567890123'),
  // Cape Verde
  'CV': new Specification('CV', 25, 'F21', 'CV30123456789012345678901'),
  // Algeria
  'DZ': new Specification('DZ', 24, 'F20', 'DZ8612345678901234567890'),
  // Iran
  'IR': new Specification('IR', 26, 'F22', 'IR861234568790123456789012'),
  // Madagascar
  'MG': new Specification('MG', 27, 'F23', 'MG1812345678901234567890123'),
  // Mali
  'ML': new Specification('ML', 28, 'U01F23', 'ML15A12345678901234567890123'),
  // Mozambique
  'MZ': new Specification('MZ', 25, 'F21', 'MZ25123456789012345678901'),
  // Senegal
  'SN': new Specification('SN', 28, 'U01F23', 'SN52A12345678901234567890123'),

  // The following are regional and administrative French Republic subdivision IBAN specification (same structure as FR, only country code vary)

  'GF': new Specification(
    'GF',
    27,
    'F05F05A11F02',
    'GF121234512345123456789AB13',
  ),

  'GP': new Specification(
    'GP',
    27,
    'F05F05A11F02',
    'GP791234512345123456789AB13',
  ),

  'MQ': new Specification(
    'MQ',
    27,
    'F05F05A11F02',
    'MQ221234512345123456789AB13',
  ),

  'RE': new Specification(
    'RE',
    27,
    'F05F05A11F02',
    'RE131234512345123456789AB13',
  ),

  'PF': new Specification(
    'PF',
    27,
    'F05F05A11F02',
    'PF281234512345123456789AB13',
  ),

  'TF': new Specification(
    'TF',
    27,
    'F05F05A11F02',
    'TF891234512345123456789AB13',
  ),

  'YT': new Specification(
    'YT',
    27,
    'F05F05A11F02',
    'YT021234512345123456789AB13',
  ),

  'NC': new Specification(
    'NC',
    27,
    'F05F05A11F02',
    'NC551234512345123456789AB13',
  ),

  'BL': new Specification(
    'BL',
    27,
    'F05F05A11F02',
    'BL391234512345123456789AB13',
  ),

  'MF': new Specification(
    'MF',
    27,
    'F05F05A11F02',
    'MF551234512345123456789AB13',
  ),

  'PM': new Specification(
    'PM',
    27,
    'F05F05A11F02',
    'PM071234512345123456789AB13',
  ),

  'WF': new Specification(
    'WF',
    27,
    'F05F05A11F02',
    'WF621234512345123456789AB13',
  ),
};
