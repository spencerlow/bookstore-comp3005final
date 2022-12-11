insert into Bookstore
values ('1','Look Inna Book');

-- uid userbilling usershipping account_type cartID storeID
insert into Users
values ('0','warehouse','warehouse','owner','0','1');
values ('1','baseline 12','baseline 13','customer','1','1');

insert into publisher
values ('1','5282 Manufacturers Avenue','Magpie@godaddy.com','6388473465700886'),
('2','064 Pine View Hill','Stork@gnu.org','56102310415599481'),
('3','89 Miller Parkway','Python@latimes.com','3556138670716604'),
('4','1 Butterfield Terrace','Duck@virginia.edu','3547701303889122'),
('5','36979 3rd Pass','Skimmer@microsoft.com','3556697747519895');

-- ISBN NAME stockQuantity royalty lastMonthSales page_Num price pID
insert into book
Values ('671357199-9','Anhalt','19','4','3','407','22.65','1'),
('744386732-8','Graedel','17','3','8','36','10.5','1'),
('331544036-0','Talmadge','20','7','12','100','10.82','1'),
('440671427-8','Jackson','20','7','4','378','13.26','1'),
('436114741-8','Farmco','11','3','2','118','17.93','2'),
('235756899-2','Monica','17','7','6','219','5.04','2'),
('863635630-X','Old Shore','19','2','1','457','9.29','2'),
('238658181-0','Mallory','20','8','10','497','8.14','2'),
('628187675-X','Ilene','17','5','3','338','10.61','3'),
('016563749-8','Waxwing','16','7','6','132','12.94','3'),
('589356396-4','Onsgard','17','2','5','460','24.49','3'),
('942414703-1','Kedzie','18','5','11','2','25.28','3'),
('940693916-9','Summerview','16','4','8','315','18.58','4'),
('126686308-7','Jenna','13','8','4','152','22.41','4'),
('591048290-4','Mendota','14','2','1','274','18.87','4'),
('989997330-0','Old Shore','14','7','2','318','25.07','4'),
('535793587-4','Lakeland','10','5','12','345','10.66','5'),
('235310396-0','Green Ridge','16','4','15','88','22.76','5'),
('658147303-0','Blaine','20','9','3','434','23.33','5'),
('260911225-4','Elka','14','5','8','312','20.89','5');

-- pid,phonenumber
insert into Has_numbers
values ('2','6865660250'),
('1','2534205697'),
('2','8994742155'),
('3','3547420777'),
('1','1083163697'),
('5','7258307915'),
('5','1743775869'),
('4','2413714624'),
('1','2725457997'),
('2','2479192187');

-- orderID cur_location uid orderBilling orderShipping
insert into Orders
values ('0','warehouse','0','warehouse','warehouse');

-- isbn orderID phone_numbers author genre 
-- NEW ASSUMPT, EACH BOOK HAS A DIRECT NUMBER TO A CERTAIN DEPARTMENT OF ITS PUBLISHER
insert into Book_records
values ('671357199-9','0','2534205697','Fitzgerld','Mystery'),
('671357199-9','0','2534205697','Scotty','Mystery'),
('744386732-8','0','1083163697','Fitzgerld','Mystery'),
('744386732-8','0','1083163697','Scotty','Mystery'),
('331544036-0','0','2725457997','Magpie','Horror'),
('440671427-8','0','2725457997','Magpie','Comedy'),
('436114741-8','0','2725457997','Fitzgerld','Thriller'),

('436114741-8','0','6865660250','Scotty','Mystery'),
('235756899-2','0','6865660250','Miller','Comedy'),
('863635630-X','0','8994742155','Hechlin','Comedy'),
('863635630-X','0','8994742155','Spackman','Drama'),
('238658181-0','0','2479192187','Tomet','Comedy'),

('628187675-X','0','3547420777','MacCafferty','Drama'),
('016563749-8','0','3547420777','Chirm','Comedy'),
('589356396-4','0','3547420777','Lohan','Comedy'),
('942414703-1','0','3547420777','O Growgane','Comedy'),

('940693916-9','0','2413714624','Fateley','Comedy'),
('126686308-7','0','2413714624','Olek','Action'),
('591048290-4','0','2413714624','Dubique','Documentary'),
('989997330-0','0','2413714624','O Finan','Drama'),

('535793587-4','0','7258307915','Bahl','Comedy'),
('235310396-0','0','7258307915','St. Pierre','Documentary'),
('658147303-0','0','1743775869','Pollok','Crime'),
('260911225-4','0','1743775869','Cutsforth','Action');




/*
insert into Order_contents
values
*/

