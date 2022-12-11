
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

--searchQuery -- SPENCER LOOK IDK HOW IT WORKS
SELECT * FROM public.users ORDER BY UID ASC
SELECT * FROM public.users

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

--controlPanel -- SPENCER
SELECT * FROM public.publisher
SELECT * FROM public.book ORDER BY isbn ASC
INSERT into public.book VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
SELECT * FROM public.has_numbers WHERE pid = $1
INSERT into public.book_records VALUES ($1,$2,$3,$4,$5)

--removeBook
-- Deletes a book from book relation with specified isbn, this is a cascading delete
DELETE FROM book WHERE isbn =$1