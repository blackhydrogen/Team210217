1. Install Postgres SQL 9.5.
  - Make sure to set the default port to **5432**.
  - Usually they will suggest the default superuser username to be **postgres**. Just accept it.
  - Set the default superuser's password to anything you wish (you got to remember it though, duh).
2. Create a new user called **letsfund**
  1. Start command prompt/shell.
  2. Go into the Postgres's installation folder, then into **/bin** (e.g. C:\Program Files\PostgreSQL\9.5\bin).
  3. Type the following command:
  ```
  createuser -d -P -U **postgres** letsfund
  ```
  **postgres** above is the default superuser username. Replace it accordingly, if needed.
  4. It will prompt you for a password for the new user **letsfund**. Enter **gofundyourself** as password.
  5. It will then prompt you for **postgres**'s password. Enter it (what you set in step 1).
  6. Don't close the command prompt/shell.
3. Create a new database called **letsfund** (confusing, I know)
  1. In the same command prompt/shell from previous step, type in
  ```psql -U letsfund -d postgres -a -f C:\path\to\script0.sql```.
  Enter **gofundyourself** as the password.
  2. psql should exit with no errors. Don't close the command prompt/shell.
4. Now we start creating the databases we need for the server/app. Current there's only 1 script to run.
  1. In the same command prompt/shell from previous step, type in
  ```
  psql -U letsfund -a -f C:\path\to\script1.sql
  ```
  2. psql should exit with no errors. We're done (for now).