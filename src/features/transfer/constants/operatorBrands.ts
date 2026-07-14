import type {ImageSourcePropType} from 'react-native';
import {operatorLogos} from '../../../assets';

export type OperatorBrandCode = 'WAVE' | 'ORANGE' | 'MTN' | 'MOOV';

export type OperatorBrand = {
  code: OperatorBrandCode;
  name: string;
  color: string;
  /**
   * Fond du conteneur logo — aligné sur le fond opaque de l’asset
   * pour éviter les aureoles blanches.
   */
  logoPlate: string;
  logo: ImageSourcePropType;
};

export const OPERATOR_BRANDS: OperatorBrand[] = [
  {
    code: 'WAVE',
    name: 'Wave',
    color: '#1DC8FF',
    logoPlate: '#5EC8F0',
    logo: operatorLogos.wave,
  },
  {
    code: 'ORANGE',
    name: 'Orange Money',
    color: '#FF7900',
    logoPlate: '#000000',
    logo: operatorLogos.orange,
  },
  {
    code: 'MTN',
    name: 'MTN MoMo',
    color: '#FFCC00',
    logoPlate: '#005F63',
    logo: operatorLogos.mtn,
  },
  {
    code: 'MOOV',
    name: 'Moov Money',
    color: '#0066B3',
    logoPlate: '#000000',
    logo: operatorLogos.moov,
  },
];

export const COUNTRY_FLAGS: Record<string, string> = {
  SN: '🇸🇳',
  CI: '🇨🇮',
  ML: '🇲🇱',
  BF: '🇧🇫',
};

export function getBrandByCode(code?: string): OperatorBrand | undefined {
  return OPERATOR_BRANDS.find(b => b.code === code);
}
