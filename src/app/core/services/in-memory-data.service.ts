import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Banner, City, Establishment, Offer, Purchase } from '../../models';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const banners: Banner[] = [
      { id: 1, imageUrl: '/assets/banners/Banner - Academia Fitness.png', linkUrl: '/offers', title: 'Academia Fitness' },
      { id: 2, imageUrl: '/assets/banners/Banner - Beauty Salon.png', linkUrl: '/offers', title: 'Beauty Salon' },
      { id: 3, imageUrl: '/assets/banners/Banner - Café Especial.png', linkUrl: '/offers', title: 'Café Especial' },
      { id: 4, imageUrl: '/assets/banners/Banner - Electronic Store.png', linkUrl: '/offers', title: 'Electronic Store' },
      { id: 5, imageUrl: '/assets/banners/Banner - Restaurante Jantar.png', linkUrl: '/offers', title: 'Restaurante Jantar' }
    ];

    const cities: City[] = [
      { id: 1, name: 'São Paulo', state: 'SP' },
      { id: 2, name: 'Rio de Janeiro', state: 'RJ' },
      { id: 3, name: 'Brasília', state: 'DF' },
      { id: 4, name: 'Salvador', state: 'BA' },
      { id: 5, name: 'Fortaleza', state: 'CE' },
      { id: 6, name: 'Belo Horizonte', state: 'MG' },
      { id: 7, name: 'Manaus', state: 'AM' },
      { id: 8, name: 'Curitiba', state: 'PR' },
      { id: 9, name: 'Recife', state: 'PE' },
      { id: 10, name: 'Goiânia', state: 'GO' },
      { id: 11, name: 'Porto Alegre', state: 'RS' },
      { id: 12, name: 'Belém', state: 'PA' },
      { id: 13, name: 'Guarulhos', state: 'SP' },
      { id: 14, name: 'Campinas', state: 'SP' },
      { id: 15, name: 'São Luís', state: 'MA' },
      { id: 16, name: 'São Gonçalo', state: 'RJ' },
      { id: 17, name: 'Maceió', state: 'AL' },
      { id: 18, name: 'Duque de Caxias', state: 'RJ' },
      { id: 19, name: 'Natal', state: 'RN' },
      { id: 20, name: 'Teresina', state: 'PI' }
    ];

    const establishments: Establishment[] = [
      { id: 1, name: 'Supermercado Central', cityId: 1 },
      { id: 2, name: 'Padaria do João', cityId: 1 },
      { id: 3, name: 'Farmácia Saúde', cityId: 1 },
      { id: 4, name: 'Restaurante Sabor', cityId: 2 },
      { id: 5, name: 'Loja de Roupas Fashion', cityId: 2 },
      { id: 6, name: 'Mercado Popular', cityId: 3 },
      { id: 7, name: 'Café Expresso', cityId: 4 },
      { id: 8, name: 'Pet Shop Amigo', cityId: 5 },
      { id: 9, name: 'Livraria Cultura', cityId: 6 },
      { id: 10, name: 'Eletrônicos Tech', cityId: 7 },
      { id: 11, name: 'Padaria Pão Quente', cityId: 8 },
      { id: 12, name: 'Supermercado Bom Preço', cityId: 9 },
      { id: 13, name: 'Farmácia Popular', cityId: 10 },
      { id: 14, name: 'Restaurante Italiano', cityId: 11 },
      { id: 15, name: 'Loja de Calçados', cityId: 12 }
    ];

    // Available post images
    // Encode % character to %25 to avoid URI malformed errors
    const encodeImagePath = (path: string): string => {
      return path.replace(/%/g, '%25');
    };

    const postImages = [
      encodeImagePath('/assets/posts/Instagram Post - Beauty 30%.png'),
      encodeImagePath('/assets/posts/Instagram Post - Café 20%.png'),
      encodeImagePath('/assets/posts/Instagram Post - Fitness Gratis.png'),
      encodeImagePath('/assets/posts/Instagram Post - Restaurante 25%.png'),
      encodeImagePath('/assets/posts/Instagram Post - Tech 25%.png')
    ];

    const offers: Offer[] = [
      { id: 1, productName: 'Slip On Aramis Daily', establishmentName: 'Loja de Calçados', establishmentId: 15, price: 169.99, image: postImages[2], originalPrice: 339.98 },
      { id: 2, productName: 'Tênis Coca Cola Houston', establishmentName: 'Loja de Calçados', establishmentId: 15, price: 144.99, image: postImages[2], originalPrice: 258.91 },
      { id: 3, productName: 'Tênis Reserva Recorte Preto', establishmentName: 'Loja de Calçados', establishmentId: 15, price: 329.99, image: postImages[2], originalPrice: 388.22 },
      { id: 4, productName: 'Camisa Po Dudalina R', establishmentName: 'Loja de Roupas Fashion', establishmentId: 5, price: 134.99, image: postImages[0], originalPrice: 179.99 },
      { id: 5, productName: 'Produto Premium', establishmentName: 'Supermercado Central', establishmentId: 1, price: 89.90, image: postImages[1], originalPrice: 119.90 },
      { id: 6, productName: 'Oferta Especial', establishmentName: 'Padaria do João', establishmentId: 2, price: 12.50, image: postImages[3], originalPrice: 18.90 },
      { id: 7, productName: 'Promoção Imperdível', establishmentName: 'Farmácia Saúde', establishmentId: 3, price: 45.90, image: postImages[0], originalPrice: 65.90 },
      { id: 8, productName: 'Desconto Exclusivo', establishmentName: 'Restaurante Sabor', establishmentId: 4, price: 35.90, image: postImages[3], originalPrice: 49.90 },
      { id: 9, productName: 'Produto em Destaque', establishmentName: 'Eletrônicos Tech', establishmentId: 10, price: 299.90, image: postImages[4], originalPrice: 399.90 },
      { id: 10, productName: 'Oferta Limitada', establishmentName: 'Pet Shop Amigo', establishmentId: 8, price: 79.90, image: postImages[2], originalPrice: 99.90 },
      { id: 11, productName: 'Super Oferta', establishmentName: 'Livraria Cultura', establishmentId: 9, price: 29.90, image: postImages[1], originalPrice: 39.90 },
      { id: 12, productName: 'Promoção Relâmpago', establishmentName: 'Mercado Popular', establishmentId: 6, price: 15.90, image: postImages[3], originalPrice: 22.90 },
      { id: 13, productName: 'Oferta do Dia', establishmentName: 'Café Expresso', establishmentId: 7, price: 19.90, image: postImages[1], originalPrice: 29.90 },
      { id: 14, productName: 'Desconto Especial', establishmentName: 'Supermercado Bom Preço', establishmentId: 12, price: 24.90, image: postImages[0], originalPrice: 34.90 },
      { id: 15, productName: 'Promoção Final', establishmentName: 'Restaurante Italiano', establishmentId: 14, price: 42.90, image: postImages[3], originalPrice: 59.90 },
      { id: 16, productName: 'Oferta Exclusiva', establishmentName: 'Farmácia Popular', establishmentId: 13, price: 18.90, image: postImages[0], originalPrice: 28.90 },
      { id: 17, productName: 'Produto em Promoção', establishmentName: 'Padaria Pão Quente', establishmentId: 11, price: 8.90, image: postImages[1], originalPrice: 12.90 },
      { id: 18, productName: 'Super Desconto', establishmentName: 'Eletrônicos Tech', establishmentId: 10, price: 199.90, image: postImages[4], originalPrice: 299.90 },
      { id: 19, productName: 'Oferta Especial', establishmentName: 'Loja de Roupas Fashion', establishmentId: 5, price: 59.90, image: postImages[0], originalPrice: 89.90 },
      { id: 20, productName: 'Promoção Imperdível', establishmentName: 'Supermercado Central', establishmentId: 1, price: 34.90, image: postImages[2], originalPrice: 49.90 },
      { id: 21, productName: 'Desconto Exclusivo', establishmentName: 'Café Expresso', establishmentId: 7, price: 22.90, image: postImages[1], originalPrice: 32.90 },
      { id: 22, productName: 'Oferta Limitada', establishmentName: 'Pet Shop Amigo', establishmentId: 8, price: 69.90, image: postImages[2], originalPrice: 89.90 },
      { id: 23, productName: 'Super Oferta', establishmentName: 'Mercado Popular', establishmentId: 6, price: 19.90, image: postImages[3], originalPrice: 27.90 },
      { id: 24, productName: 'Promoção Relâmpago', establishmentName: 'Restaurante Sabor', establishmentId: 4, price: 28.90, image: postImages[3], originalPrice: 38.90 },
      { id: 25, productName: 'Oferta do Dia', establishmentName: 'Farmácia Saúde', establishmentId: 3, price: 15.90, image: postImages[0], originalPrice: 22.90 }
    ];

    const purchases: Purchase[] = [
      // Janeiro 2024
      { id: 1, date: '2024-01-15', time: '14:30', store: 'Supermercado Central', amount: 125.50, category: 'Alimentação' },
      { id: 2, date: '2024-01-16', time: '09:15', store: 'Farmácia Saúde', amount: 45.80, category: 'Saúde' },
      { id: 3, date: '2024-01-17', time: '18:45', store: 'Restaurante Sabor', amount: 67.90, category: 'Alimentação' },
      { id: 4, date: '2024-01-18', time: '11:20', store: 'Padaria do João', amount: 12.50, category: 'Alimentação' },
      { id: 5, date: '2024-01-19', time: '15:30', store: 'Loja de Roupas Fashion', amount: 189.90, category: 'Vestuário' },
      { id: 6, date: '2024-01-20', time: '10:00', store: 'Eletrônicos Tech', amount: 899.90, category: 'Eletrônicos' },
      { id: 7, date: '2024-01-21', time: '16:20', store: 'Pet Shop Amigo', amount: 89.90, category: 'Pet' },
      { id: 8, date: '2024-01-22', time: '13:45', store: 'Supermercado Central', amount: 95.30, category: 'Alimentação' },
      { id: 9, date: '2024-01-23', time: '19:00', store: 'Restaurante Italiano', amount: 78.50, category: 'Alimentação' },
      { id: 10, date: '2024-01-24', time: '08:30', store: 'Farmácia Popular', amount: 32.40, category: 'Saúde' },
      { id: 11, date: '2024-01-25', time: '14:15', store: 'Loja de Calçados', amount: 149.90, category: 'Vestuário' },
      { id: 12, date: '2024-01-26', time: '17:30', store: 'Livraria Cultura', amount: 59.90, category: 'Educação' },
      { id: 13, date: '2024-01-27', time: '12:00', store: 'Café Expresso', amount: 24.90, category: 'Alimentação' },
      { id: 14, date: '2024-01-28', time: '15:45', store: 'Mercado Popular', amount: 67.80, category: 'Alimentação' },
      { id: 15, date: '2024-01-29', time: '10:30', store: 'Supermercado Bom Preço', amount: 134.20, category: 'Alimentação' },
      { id: 16, date: '2024-01-30', time: '20:00', store: 'Restaurante Sabor', amount: 95.60, category: 'Alimentação' },
      { id: 17, date: '2024-01-31', time: '07:45', store: 'Padaria do João', amount: 8.90, category: 'Alimentação' },
      
      // Fevereiro 2024
      { id: 18, date: '2024-02-01', time: '09:45', store: 'Farmácia Saúde', amount: 28.90, category: 'Saúde' },
      { id: 19, date: '2024-02-02', time: '16:00', store: 'Eletrônicos Tech', amount: 79.90, category: 'Eletrônicos' },
      { id: 20, date: '2024-02-03', time: '11:15', store: 'Padaria Pão Quente', amount: 18.50, category: 'Alimentação' },
      { id: 21, date: '2024-02-04', time: '14:30', store: 'Loja de Roupas Fashion', amount: 219.80, category: 'Vestuário' },
      { id: 22, date: '2024-02-05', time: '13:20', store: 'Supermercado Central', amount: 156.75, category: 'Alimentação' },
      { id: 23, date: '2024-02-06', time: '19:30', store: 'Restaurante Italiano', amount: 112.40, category: 'Alimentação' },
      { id: 24, date: '2024-02-07', time: '08:15', store: 'Farmácia Popular', amount: 42.60, category: 'Saúde' },
      { id: 25, date: '2024-02-08', time: '15:00', store: 'Pet Shop Amigo', amount: 125.90, category: 'Pet' },
      { id: 26, date: '2024-02-09', time: '10:45', store: 'Mercado Popular', amount: 89.30, category: 'Alimentação' },
      { id: 27, date: '2024-02-10', time: '17:20', store: 'Loja de Calçados', amount: 199.90, category: 'Vestuário' },
      { id: 28, date: '2024-02-11', time: '12:30', store: 'Café Expresso', amount: 35.50, category: 'Alimentação' },
      { id: 29, date: '2024-02-12', time: '16:45', store: 'Supermercado Bom Preço', amount: 178.20, category: 'Alimentação' },
      { id: 30, date: '2024-02-13', time: '09:00', store: 'Livraria Cultura', amount: 74.90, category: 'Educação' },
      { id: 31, date: '2024-02-14', time: '20:15', store: 'Restaurante Sabor', amount: 145.80, category: 'Alimentação' },
      { id: 32, date: '2024-02-15', time: '11:30', store: 'Eletrônicos Tech', amount: 349.90, category: 'Eletrônicos' },
      { id: 33, date: '2024-02-16', time: '14:00', store: 'Farmácia Saúde', amount: 38.50, category: 'Saúde' },
      { id: 34, date: '2024-02-17', time: '18:30', store: 'Padaria do João', amount: 22.40, category: 'Alimentação' },
      { id: 35, date: '2024-02-18', time: '10:20', store: 'Loja de Roupas Fashion', amount: 279.90, category: 'Vestuário' },
      { id: 36, date: '2024-02-19', time: '15:50', store: 'Supermercado Central', amount: 203.60, category: 'Alimentação' },
      { id: 37, date: '2024-02-20', time: '08:40', store: 'Pet Shop Amigo', amount: 95.80, category: 'Pet' },
      { id: 38, date: '2024-02-21', time: '19:00', store: 'Restaurante Italiano', amount: 98.70, category: 'Alimentação' },
      { id: 39, date: '2024-02-22', time: '13:10', store: 'Mercado Popular', amount: 112.50, category: 'Alimentação' },
      { id: 40, date: '2024-02-23', time: '16:30', store: 'Loja de Calçados', amount: 169.90, category: 'Vestuário' },
      { id: 41, date: '2024-02-24', time: '11:45', store: 'Farmácia Popular', amount: 55.20, category: 'Saúde' },
      { id: 42, date: '2024-02-25', time: '14:25', store: 'Café Expresso', amount: 28.90, category: 'Alimentação' },
      { id: 43, date: '2024-02-26', time: '09:30', store: 'Supermercado Bom Preço', amount: 167.40, category: 'Alimentação' },
      { id: 44, date: '2024-02-27', time: '17:15', store: 'Eletrônicos Tech', amount: 129.90, category: 'Eletrônicos' },
      { id: 45, date: '2024-02-28', time: '12:00', store: 'Livraria Cultura', amount: 89.90, category: 'Educação' },
      { id: 46, date: '2024-02-29', time: '18:45', store: 'Restaurante Sabor', amount: 87.30, category: 'Alimentação' },
      
      // Março 2024
      { id: 47, date: '2024-03-01', time: '08:20', store: 'Padaria Pão Quente', amount: 15.60, category: 'Alimentação' },
      { id: 48, date: '2024-03-02', time: '15:30', store: 'Loja de Roupas Fashion', amount: 239.90, category: 'Vestuário' },
      { id: 49, date: '2024-03-03', time: '10:10', store: 'Supermercado Central', amount: 189.80, category: 'Alimentação' },
      { id: 50, date: '2024-03-04', time: '19:20', store: 'Pet Shop Amigo', amount: 115.90, category: 'Pet' },
      { id: 51, date: '2024-03-05', time: '13:40', store: 'Farmácia Saúde', amount: 48.30, category: 'Saúde' },
      { id: 52, date: '2024-03-06', time: '16:50', store: 'Restaurante Italiano', amount: 134.50, category: 'Alimentação' },
      { id: 53, date: '2024-03-07', time: '11:25', store: 'Mercado Popular', amount: 95.70, category: 'Alimentação' },
      { id: 54, date: '2024-03-08', time: '14:15', store: 'Loja de Calçados', amount: 229.90, category: 'Vestuário' },
      { id: 55, date: '2024-03-09', time: '09:50', store: 'Café Expresso', amount: 32.40, category: 'Alimentação' },
      { id: 56, date: '2024-03-10', time: '17:30', store: 'Supermercado Bom Preço', amount: 145.20, category: 'Alimentação' },
      { id: 57, date: '2024-03-11', time: '12:45', store: 'Eletrônicos Tech', amount: 199.90, category: 'Eletrônicos' },
      { id: 58, date: '2024-03-12', time: '18:00', store: 'Restaurante Sabor', amount: 76.80, category: 'Alimentação' },
      { id: 59, date: '2024-03-13', time: '08:35', store: 'Farmácia Popular', amount: 62.10, category: 'Saúde' },
      { id: 60, date: '2024-03-14', time: '15:20', store: 'Padaria do João', amount: 19.80, category: 'Alimentação' },
      { id: 61, date: '2024-03-15', time: '10:55', store: 'Loja de Roupas Fashion', amount: 189.90, category: 'Vestuário' },
      { id: 62, date: '2024-03-16', time: '20:10', store: 'Supermercado Central', amount: 167.30, category: 'Alimentação' },
      { id: 63, date: '2024-03-17', time: '13:25', store: 'Pet Shop Amigo', amount: 88.50, category: 'Pet' },
      { id: 64, date: '2024-03-18', time: '16:40', store: 'Livraria Cultura', amount: 64.90, category: 'Educação' },
      { id: 65, date: '2024-03-19', time: '11:15', store: 'Restaurante Italiano', amount: 156.40, category: 'Alimentação' },
      { id: 66, date: '2024-03-20', time: '14:50', store: 'Mercado Popular', amount: 108.90, category: 'Alimentação' },
      { id: 67, date: '2024-03-21', time: '09:25', store: 'Farmácia Saúde', amount: 35.70, category: 'Saúde' },
      { id: 68, date: '2024-03-22', time: '17:45', store: 'Loja de Calçados', amount: 179.90, category: 'Vestuário' },
      { id: 69, date: '2024-03-23', time: '12:30', store: 'Café Expresso', amount: 41.20, category: 'Alimentação' },
      { id: 70, date: '2024-03-24', time: '19:15', store: 'Supermercado Bom Preço', amount: 198.60, category: 'Alimentação' },
      { id: 71, date: '2024-03-25', time: '08:50', store: 'Eletrônicos Tech', amount: 249.90, category: 'Eletrônicos' },
      { id: 72, date: '2024-03-26', time: '15:35', store: 'Restaurante Sabor', amount: 92.40, category: 'Alimentação' },
      { id: 73, date: '2024-03-27', time: '10:20', store: 'Padaria Pão Quente', amount: 24.30, category: 'Alimentação' },
      { id: 74, date: '2024-03-28', time: '18:25', store: 'Loja de Roupas Fashion', amount: 259.90, category: 'Vestuário' },
      { id: 75, date: '2024-03-29', time: '13:55', store: 'Supermercado Central', amount: 176.80, category: 'Alimentação' },
      { id: 76, date: '2024-03-30', time: '16:10', store: 'Pet Shop Amigo', amount: 102.40, category: 'Pet' },
      { id: 77, date: '2024-03-31', time: '11:40', store: 'Farmácia Popular', amount: 58.90, category: 'Saúde' }
    ];

    return { banners, cities, establishments, offers, purchases };
  }
}

