/*
+needs reordering, just putting outline here first
+the types are temporary here
*/
create table IF NOT EXISTS Publisher
	(
		pID INT UNIQUE NOT NULL,
		address VARCHAR (25) NOT NULL,
		email VARCHAR (25) NOT NULL,
		banking VARCHAR (20) NOT NULL,
		primary key(pID)
    );

create table IF NOT EXISTS  Book
	(
		ISBN VARCHAR(11) UNIQUE NOT NULL,
		name VARCHAR(15) NOT NULL,
		stockQuantity INT NOT NULL,
		royalty INT NOT NULL,
		lastMonthSales INT NOT NULL,
		page_Num INT NOT NULL,
		price numeric(10,2) NOT NULL,
		pID INT NOT NULL,
		
		primary key (ISBN),
		foreign key (pID) references Publisher (pID)        
    );

create table IF NOT EXISTS  Bookstore
	(
		storeID INT UNIQUE NOT NULL,
		name VARCHAR (10) NOT NULL,
		primary key (storeID)
    );

create table IF NOT EXISTS  Users
	(
		UID INT UNIQUE NOT NULL,
		userBilling VARCHAR (25) NOT NULL,
		userShipping VARCHAR (25) NOT NULL,
		account_type VARCHAR (10) NOT NULL,
		cartID INT NOT NULL,
		storeID INT NOT NULL,
		primary key (UID),
		foreign key (storeID) references Bookstore (storeID)
    );

create table IF NOT EXISTS  Cart
	(
		UID INT NOT NULL,
		ISBN VARCHAR(11) NOT NULL,
		cartQuantity INT NOT NULL,
		primary key (UID,ISBN),
		foreign key (UID) references Users (UID),
		foreign key (ISBN) references Book (ISBN)
    );

create table IF NOT EXISTS  Orders
	(
		orderID INT UNIQUE NOT NULL,
		cur_location VARCHAR (25) NOT NULL,
		UID INT UNIQUE NOT NULL,
		orderBilling VARCHAR (25) NOT NULL,
		orderShipping VARCHAR (25) NOT NULL,
		primary key (orderID),
		foreign key (UID) references Users (UID)
    );

create table IF NOT EXISTS  Order_contents
	(
		orderID INT UNIQUE NOT NULL,
		ISBN VARCHAR(11) UNIQUE NOT NULL,
		orderQuantity INT NOT NULL,
		primary key (orderID,ISBN),
		foreign key (orderID) references Orders (orderID),
		foreign key (ISBN) references Book (ISBN)
    );

create table IF NOT EXISTS  Has_numbers
	(
		pID INT NOT NULL,
		phoneNumber VARCHAR(11) UNIQUE NOT NULL,
		primary key (phoneNumber),
		foreign key (pID) references Publisher (pID)
    );

create table IF NOT EXISTS  Book_records
	(
		ISBN VARCHAR(11) NOT NULL,
		orderID INT,
		phone_numbers VARCHAR(11),
		author VARCHAR(11) NOT NULL,
		genre VARCHAR(11) NOT NULL,
		primary key (ISBN, orderID, phone_numbers, author, genre),
		foreign key (ISBN) references Book (ISBN),
		foreign key (orderID) references Orders (orderID),
		foreign key (phone_numbers) references Has_numbers (phoneNumber)
    );

