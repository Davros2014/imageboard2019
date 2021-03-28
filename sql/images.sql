DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://imageboard101.s3.amazonaws.com/HELSINKI_IKUISESTI_artikkelikuva.jpg',
--     'daveboy',
--     'Welcome to Helsinki and the future!',
--     'This photo brings back so many great memories.'
-- );
--
-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/spicedling/AkaZ9vHxk0Fk4sm7MH9wPtWLGbatVC4u.jpg',
--     'Davros2019',
--     'Nordic skies',
--     'The lights are seen around the magnetic poles of the northern and southern hemispheres. Auroras that occur in the northern hemisphere are called "Aurora Borealis" or "northern lights" and auroras that occur in the southern hempishere are called "Aurora Australis" or "southern lights"'
-- );
--
-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/imageboard2020/vyLcpxzDu2yvO4qXj-1RSUKlWeUX1pQt.jpg',
--     'MikoS44',
--     'Rovaniemi - summer '09'',
--     'The lights are seen around the magnetic poles of the northern and southern hemispheres. Auroras that occur in the northern hemisphere are called "Aurora Borealis" or "northern lights" and auroras that occur in the southern hempishere are called "Aurora Australis" or "southern lights"'
-- );
-- INSERT INTO images (url, username, title, description) VALUES (
--     'https://s3.amazonaws.com/spicedling/AkaZ9vHxk0Fk4sm7MH9wPtWLGbatVC4u.jpg',
--     'JannisK76',
--     'Finnsh Elks',
--     'We saw these beauties on our trip to Jyv\'e4skyl\'e4 last summer, can\'t wait to visit again'
-- );



 --
 --  3 | https://s3.amazonaws.com/spicedling/SCDzlnZ4ilQ_ZTjiBrBRaul7QFxMterE.jpg | MikoS44 | Helsinki at dusk  | View over the top of the Senate Square area of Helsinki, love the colours | 2019-09-13 14:59:16.489868\
 --  4 | https://s3.amazonaws.com/spicedling/R2hOgSFQ3jRmT7dMC_Gv4UJjAoQV_1ix.png | JannickW2134  | Scandinavian cottage | Cute cottage we stayed in on the border of Sweden and Norway. | 2019-09-13 15:38:27.931423\
 --  5 | https://s3.amazonaws.com/spicedling/UXLXjjM9yNHinEr-7M552ykCBsFp7SJQ.png | NicoPJ23  | Finnish Karhu!!!  | Brown bears in their natural environment, don't get too close! | 2019-09-13 15:40:38.289402\
 --  6 | https://s3.amazonaws.com/spicedling/KOxa4IUKHxlhzIuyet88l5Px02VzCT0h.jpg | DaveyP2019  | Helsinki at night    | Aerial view of the railway station region | 2019-09-13 15:43:05.201657\
 --  7 | https://s3.amazonaws.com/spicedling/TowXoJzulqmojm9oDav7uz7-dsVGDa0G.png | AarvoA1934  | Finnish Lakes   | One of the 188, 000 lakes in springtime!!!  | 2019-09-16 14:16:34.787808\
 --  8 | https://s3.amazonaws.com/spicedling/Bj2O1kDh8tFLYcT5_4wmgNXfUJaL271I.png | JohannaSky2107  | Summer Cottages   | Cottages by the lake, built on rocks from the ice age | 2019-09-16 14:18:01.726705\
 --  9 | https://s3.amazonaws.com/spicedling/o6grhIZzJ4qE_x8E0SYaVmmsFL_hUmvE.jpg | JohnSulli1981   | Downtown Helsinki    | Snowy winter time in the capital of Finland  | 2019-09-16 14:19:24.58685\
 -- 10 | https://s3.amazonaws.com/spicedling/-hcAoHhuqXtoJAKwqLWcDYzf8thxO5jH.png | DarkSkies1980  | Snow scene  | Winter wonderland in Lapland  | 2019-09-16 14:21:05.559251\
 -- 11 | https://s3.amazonaws.com/spicedling/4TMtpKzVLTdgus2umBjTS9BnJqPydt1y.jpg | DaveNokia191014 | Long winter nights   | Snow covered streets of Tampere | 2019-09-16 14:22:49.94007\
 -- 12 | https://s3.amazonaws.com/spicedling/ACRC910E-Jjzt2dmRSrZGFrSxApHc6sK.jpg | MattiH3421  | Forest in winter     | Typical scene of any given forest in winter time  | 2019-09-16 14:24:12.176723}
