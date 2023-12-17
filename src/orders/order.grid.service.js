import config from 'config';
const tepCode = `${config.tepCode}`;

export const gridState = {};

export const setGridState = (obj) => {
  Object.assign(gridState, obj);
};
export const getGridState = () => {
  if (gridState !== undefined) {
    return gridState;
  }
  return null;
};

export const getRowNameText = (params) => {
  return `${((params.row.sProduct !== '...') ? `${params.row.sProduct}` : '')
  + ((params.row.sColor !== '...') ? ` ${params.row.sColor}` : '')
  + ((params.row.sLiner !== '...') ? `, Подкл.${params.row.sLiner}` : '')
  + ((params.row.sRant !== '...') ? `, Рант.${params.row.sRant}` : '')
  + ((params.row.sShpalt !== '...') ?`, Шпал.${params.row.sShpalt}` : '')}`;
};

export const getRowAttributeText = (params, divisionCode) => {
  let res = '';
  res = `${((params.row.sVstavka !== '...') ? `Вст.${params.row.sVstavka}` : '')
  + ((params.row.sAshpalt !== '...') ? `${(divisionCode === tepCode) ? ', Шпал' : 'Крас'}.${params.row.sAshpalt}` : '')
  + ((params.row.sSpoyler !== '...') ? `${(divisionCode === tepCode) ? ', Спойл' : ', М1'}.${params.row.sSpoyler}` : '')
  + ((params.row.sGuba !== '...') ? `${(divisionCode === tepCode) ? ', Губа' : ', М2'}.${params.row.sGuba}` : '')
  + ((params.row.sKabluk !== '...') ? `${(divisionCode === tepCode) ? ', Кабл' : ', М3'}.${params.row.sKabluk}` : '')
  + ((params.row.sGelenok !== '...') ? `, Гел.${params.row.sGelenok}` : '')
  + ((params.row.sSled !== '...') ? `, След.${params.row.sSled}` : '')
  + ((params.row.sPyatka !== '...') ? `, Пят.${params.row.sPyatka}` : '')
  + ((params.row.tert) ? ', Терт' : '')
  + ((params.row.sMatirovka !== '...') ? `, Мат.${params.row.sMatirovka}` : '')
  + ((params.row.sPechat !== '...') ? `, Печ.${params.row.sPechat}` : '')
  + ((params.row.sProshiv !== '...') ? `, Прош.${params.row.sProshiv}` : '')
  + ((params.row.prodir) ? ', Продир' : '')
  + ((params.row.frez) ? ', Фрез' : '')
  + ((params.row.difersize) ? ', Полупара' : '')
  + ((params.row.attribute !== '') ? `, Доп: ${params.row.attribute}` : '')}`;
  return (res.indexOf(',') === 0) ? res.substring(1) : res;
}

