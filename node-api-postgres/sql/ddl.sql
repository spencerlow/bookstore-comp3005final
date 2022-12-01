

/*
+needs reordering, just putting outline here first
+the types are temporary here

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
	foreign key (pID) references publisher (pID)        
    );

create table Bookstore
	(
    );

create table User
	(
    );

create table Cart
	(
    );

create table Order
	(
    );

create table Order_contents
	(
    );

create table Publisher
	(
    );

create table Has_numbers
	(
    );

create table Book_records
	(
    );

*/