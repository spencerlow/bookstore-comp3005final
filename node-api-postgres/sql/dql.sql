
--getBooks
-- Returns all values in book relation and orders them by isbn asc
SELECT * FROM public.book ORDER BY isbn ASC

-- Returns all author,genre for a specific book with isbn
SELECT author,genre FROM public.book_records WHERE isbn = $1

--addCart
-- Insert new row into cart relation with values (uid,isbn,cartquantity)
INSERT into public.cart VALUES ($1,$2,$3)

--removeFromCart
-- Delete value in cart with uid and isbn specified
DELETE from public.cart WHERE uid=$1 AND isbn=$2

--getBookInfo
-- Grab book value from book relation with specified isbn
SELECT * FROM public.book WHERE isbn = $1

--getCart
-- Grab cart row from cart relation with specified uid
SELECT * FROM public.cart WHERE uid = $1
-- Select name, stockquantity and price from book relation with specified isbn
SELECT name, stockquantity, price FROM public.book WHERE isbn = $1
-- Select uid, userBilling and userShipping from book relation with specified isbn
SELECT uid,userBilling,userShipping FROM public.users WHERE uid = $1

--createOrder
-- Get number of rows in orders relation
SELECT COUNT(*) FROM public.orders
-- Insert new row into orders relation with values (new order id,warehouse,uid,billing,shipping)
INSERT into public.Orders VALUES ($1,$2,$3,$4,$5)
--Grab all books in the cart with uid 1
SELECT * FROM public.cart WHERE uid = $1
-- Insert all books into order_contents with values nextorderID,isbn, cartquantity
INSERT into public.order_contents VALUES ($1,$2,$3)
-- Decrement book stock value since it just got bought using isbn
UPDATE public.book SET stockquantity= stockquantity - 1 WHERE isbn=$1
-- Grab stockquantity,isbn,pid,lastmonthsales from book relation with isbn to check stock
SELECT stockquantity,isbn,pid,lastmonthsales FROM public.book WHERE isbn=$1
-- Grab publisher information with pid
SELECT * FROM public.publisher WHERE pid=$1
-- Delete the cart that just got turned into an order with uid and isbn specified
DELETE from public.cart WHERE uid=$1 AND isbn=$2

--getUsers
-- Returns all values in users relation and orders them by uid asc
SELECT * FROM public.users ORDER BY uid ASC
-- Create new user in users relations with values nextUID,shipping,billing,"customer",nextUID,1
INSERT into public.users VALUES ($1,$2,$3,$4,$5,$6)

--searchQuery
--Queries are dynamic, changes variables depending on user input during searching
-- Case 1 (User gives userinput)
SELECT * FROM public.'#aRelation' WHERE '#aAttribute' = '#aUserinput' ORDER BY '#aAttribute' '#aASC/DESC'
-- Case 2 (User does not give userinput)
SELECT * FROM public.'#aRelation' ORDER BY '#aAttribute' '#aASC/DESC'

--report1
-- Query that returns the count for each book (using isbn)
-- ISBN COUNT
-- xxxxx 5
SELECT isbn, count(*) FROM public.order_contents WHERE isbn IS NOT NULL GROUP BY isbn
-- gets book info from book relation with specified isbn
SELECT * FROM public.book where isbn=$1

--report2
-- Query that returns count for each time an author sells a book, uses left join to join book_records with book
SELECT book_records.author,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.author

--report3
-- Query that returns count for each time an genre sells a book, uses left join to join book_records with book
SELECT book_records.genre,  COUNT(book_records.isbn) FROM book_records LEFT JOIN order_contents ON book_records.isbn = order_contents.isbn GROUP BY book_records.genre

--controlPanel
SELECT * FROM public.publisher
SELECT * FROM public.book ORDER BY isbn ASC
-- create a new book with the following USER SPECIFIED values
-- each paraemter matches each $# respectively
    -- [newbook.isbn,newbook.name,newbook.stockQuantity,newbook.royalty,newbook.lastMonthSales,newbook.page_num,newbook.price,newbook.pid]
INSERT into public.book VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
-- find all publisher phonenumbers that match the PID of the new book
SELECT * FROM public.has_numbers WHERE pid = $1
-- for loop of inserting new book records 
    -- to ensure each matching PID phone number, each author, and each genre
    -- combination is added for the new book
-- each paraemter matches each $# respectively
    -- values: [newbook.isbn, 0, phonerow.phonenumber, author, genre],
INSERT into public.book_records VALUES ($1,$2,$3,$4,$5)

--removeBook
-- Deletes a book from book relation with specified isbn, this is a cascading delete
DELETE FROM book WHERE isbn =$1