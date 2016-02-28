1. Install Postgres SQL 9.5.
  - Make sure to set the default port to **5432**.
  - Usually they will suggest the default superuser username to be **postgres**. Just accept it, change it at the risk of being confused later.
  - Set the default superuser's password to anything you wish (you got to remember it though, duh).
2. Create a new user called **letsfund**
  1. Start command prompt/shell.
  2. Go into the Postgres's installation folder, then into **/bin** (e.g. C:\Program Files\PostgreSQL\9.5\bin).
  3. Type the following command: `createuser -d -P -U postgres letsfund`. (**postgres** is the default superuser username. Replace it accordingly, if needed.)
  4. It will prompt you for a password for the new role **letsfund**. Enter **gofundyourself** as password (then again to confirm).
  5. It will then prompt you for **postgres**'s password. Enter it (what you set in step 1).
  6. It should exit with no errors. Don't close the command prompt/shell.  
3. Now we create a new database called **letsfund** (confusing, I know)
  1. In the same command prompt/shell from previous step, type in `psql -U letsfund -d postgres -a -f C:\path\to\script0.sql`.
  2. Enter **gofundyourself** as the password.
  3. psql should exit with no errors. Don't close the command prompt/shell.
4. Now we start creating the databases we need for the server/app. Current there's only 1 script to run.
  1. In the same command prompt/shell from previous step, type in `psql -U letsfund -a -f C:\path\to\script1.sql`
  2. Enter **gofundyourself** as the password.
  3. psql should exit with no errors. Don't close the command prompt/shell.
5. Now to check we've done the right thing.
  1. In the same command prompt/shell from previous step, type in `psql -U letsfund`.
  2. Enter **gofundyourself** as the password.
  3. In the psql program that just opened, type in `\l`.
  4. You should see a row with name **letsfund** and owner as **letsfund**.
  5. Now type in `\dt`.
  6. You should see a table (under type) named **session**.
  7. `\q` to quit psql.
6. Now we need to run some preprocessing script (in preparation for our app actual schema). To run this, root access (i.e. run as p**ostgres**) is required.
  1. Type in `psql -U postgres -d letsfund -a -f C:\path\to\extension.sql`. (**postgres** is the default superuser username. Replace it accordingly, if needed.)
  2. Enter the password for **postgress** (step 1's password).
7. Now we can run the schema script.
  1. Type in `psql -U letsfund -a -f C:\path\to\schema.sql`.
8. To clean the recently added schema, type in `psql -U letsfund -a -f C:\path\to\clean.sql`.
