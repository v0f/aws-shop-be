create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
  price real,
  img_url text
);

create table if not exists stocks (
	product_id uuid unique references products (id),
  count integer
);

insert into products (title, description, price, img_url)
values
  (
    'Cinnamon Roast',
    'Short Product Description1',
    24,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/385_degrees_cinnamon_roast_coffee.png/150px-385_degrees_cinnamon_roast_coffee.png'
  ),
  (
    'American Roast',
    'Short Product Description3',
    10,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/410_degrees_american_roast_coffee.png/150px-410_degrees_american_roast_coffee.png'
  ),
  (
    'Full City Roast',
    'Short Product Description2',
    23,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/440_degrees_full_city_roast_coffee.png/150px-440_degrees_full_city_roast_coffee.png'
  ),
  (
    'French Roast',
    'Short Product Description7',
    15,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/460_degrees_french_roast_coffee.png/150px-460_degrees_french_roast_coffee.png'
  ),
  (
    'Italian Roast',
    'Short Product Description2',
    23,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/470_degrees_italian_roast_coffee.png/150px-470_degrees_italian_roast_coffee.png'
  );

insert into stocks (product_id, count)
	select id as product_id, floor(random()*50)::int as count from products;