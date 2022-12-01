

/*
+needs reordering, just putting outline here first
+the types are temporary here

create table Publisher
	(
		pID,
		address,
		email,
		banking,
		primary key(pID)
    );

create table Book
	(
		ISBN numberic(5,0) UNIQUE NOT NULL,
		stockQuantity INT NOT NULL,
		royalty INT NOT NULL,
		lastMonthSales INT NOT NULL,
		page_Num INT NOT NULL,
		price numberic(10,2) NOT NULL,
		pID numberic(5,0) NOT NULL,
		
		primary key (ISBN),
		foreign key (pID) references Publisher (pID)        
    );

create table Bookstore
	(
		storeID ,
		name ,
		primary key (storeID),
    );

create table User
	(
		UID,
		userBilling,
		userShipping,
		account_type,
		cardID,
		storeID,
		primary key (UID),
		foreign key (storeID) references Bookstore (storeID)
    );

create table Cart
	(
		UID,
		ISBN,
		cartQuantity,
		primary key (UID,ISBN),
		foreign key (UID) references User (UID),
		foreign key (ISBN) references Book (ISBN)
    );

create table Order
	(
		orderID,
		cur_location,
		UID,
		orderBilling,
		orderShipping,
		primary key (orderID),
		foreign key (UID) references User (UID)
    );

create table Order_contents
	(
		orderID,
		ISBN,
		orderQuantity,
		primary key (orderID,ISBN),
		foreign key (orderID) references Order (orderID),
		foreign key (ISBN) references Book (ISBN)
    );

create table Has_numbers
	(
		pID,
		phoneNumber,
		primary key (phoneNumber),
		foreign key (pID) references Publisher (pID)
    );

create table Book_records
	(
		ISBN,
		orderID,
		phone_numbers,
		author,
		genre,
		primary key (ISBN, orderID, phone_numbers, author, genre),
		foreign key (ISBN) references Book (ISBN),
		foreign key (orderID) references Order (orderID),
		foreign key (phone_numbers) references Has_numbers (phoneNumber),
    );

*/