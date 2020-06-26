const material = (name) => {
   switch (name) {
      case 'Листовая сталь':
         return 0.1
      case 'Винипласт':
         return 0.1
      case 'Асбестоцементные плиты или трубы':
         return 0.11
      case 'Фанера':
         return 0.12
      case 'Шлакоалебастровые плиты':
         return 1
      case 'Шлакобетонные плиты':
         return 1.5
      case 'Кирпич':
         return 4
      case 'Штукатурка':
         return 10
      case 'Гибкий растянутый':
         return 1
      case 'Гибкий полусложенный':
            return 10
      default:
         return 0.1
         break;
   }
}

module.exports = material;