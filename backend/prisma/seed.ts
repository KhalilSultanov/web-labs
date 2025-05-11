// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Сначала создадим категории, если их ещё нет
    const category = await prisma.category.upsert({
        where: { name: 'Двигатель' },
        update: {},
        create: { name: 'Двигатель' },
    });

    // Теперь создадим популярные товары
    await prisma.product.createMany({
        data: [
            {
                name: 'Клапан впускной',
                manufacturer: 'Россия',
                price: 1500,
                image: '/img/valve.jpg',
                categoryId: category.id,
            },
            {
                name: 'Фильтр масляный',
                manufacturer: 'Китай',
                price: 800,
                image: '/img/filter.jpg',
                categoryId: category.id,
            },
            {
                name: 'Свеча зажигания',
                manufacturer: 'Bosch',
                price: 400,
                image: '/img/spark.jpg',
                categoryId: category.id,
            },
        ],
    });

    console.log('✅ Популярные товары успешно добавлены');
}

main()
    .catch((e) => {
        console.error('❌ Ошибка при сидировании:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
