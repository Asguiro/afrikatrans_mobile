import type {ImageSourcePropType} from 'react-native';
import {operatorLogos} from '../../../assets';

export type OperatorBrandCode =
  | 'WAVE'
  | 'ORANGE'
  | 'MTN'
  | 'MOOV'
  | 'FREE'
  | 'AIRTEL'
  | 'SAMA';

export type OperatorBrand = {
  code: OperatorBrandCode;
  name: string;
  color: string;
  /**
   * Fond du conteneur logo — aligné sur le fond opaque de l’asset
   * pour éviter les aureoles blanches.
   */
  logoPlate: string;
  /** Asset optionnel : sinon initiales affichées. */
  logo?: ImageSourcePropType;
  /** Initiales fallback (ex. Free / Airtel / Sama). */
  initials: string;
};

export const OPERATOR_BRANDS: OperatorBrand[] = [
  {
    code: 'WAVE',
    name: 'Wave',
    color: '#1DC8FF',
    logoPlate: '#5EC8F0',
    logo: operatorLogos.wave,
    initials: 'W',
  },
  {
    code: 'ORANGE',
    name: 'Orange Money',
    color: '#FF7900',
    logoPlate: '#000000',
    logo: operatorLogos.orange,
    initials: 'OM',
  },
  {
    code: 'MTN',
    name: 'MTN MoMo',
    color: '#FFCC00',
    logoPlate: '#005F63',
    logo: operatorLogos.mtn,
    initials: 'MTN',
  },
  {
    code: 'MOOV',
    name: 'Moov Money',
    color: '#0066B3',
    logoPlate: '#000000',
    logo: operatorLogos.moov,
    initials: 'MV',
  },
  {
    code: 'FREE',
    name: 'Free Money',
    color: '#E30613',
    logoPlate: '#E30613',
    initials: 'FM',
  },
  {
    code: 'AIRTEL',
    name: 'Airtel Money',
    color: '#ED1C24',
    logoPlate: '#ED1C24',
    initials: 'AM',
  },
  {
    code: 'SAMA',
    name: 'Sama Money',
    color: '#0B6E4F',
    logoPlate: '#0B6E4F',
    initials: 'SM',
  },
];

/** Pays MVP AfrikaTrans (alignés couverture AfribaPay cible). */
export const COUNTRY_FLAGS: Record<string, string> = {
  ML: '🇲🇱',
  SN: '🇸🇳',
  CI: '🇨🇮',
  GA: '🇬🇦',
  CF: '🇨🇫',
};

export function getBrandByCode(code?: string): OperatorBrand | undefined {
  return OPERATOR_BRANDS.find(b => b.code === code);
}
