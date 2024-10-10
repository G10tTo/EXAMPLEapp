# App Enhancements

## S[13] Backend Database and API Feature: Add Badge Points Feature Implementation by @Georgy29 - Georgy Blokhin

- This pull request introduces implementation of the "Add Badge Points" feature.

## Database Changes
- **Added Column**: The `badges_list` table has been updated to include a new column:
  - `points INT CHECK (points >= 0 AND points <= 100) DEFAULT 0`
- This change enables the storage of points associated with each badge.

## Backend Changes
- Updated the API to handle points during badge creation and editing.
    - Modified the `PUT` and `POST` methods in `index.js`.
- Implemented validation logic in the API to ensure that the points entered are numeric and within the specified range. 

#### Additional Comment:
- In the `PUT` method, I opted for a composable query since editing points is optional. If the user does not provide a value for points, we can handle this in two ways:
  - **Option A:** Make a call to the database to retrieve the current points and submit the same value.
  - **Option B:** Use a composable query that conditionally adds points to the update:
    ```javascript
    // If points are provided, add it to the update query
    if (points !== undefined) {
        query += ', points=$4';
        values.push(points);
    }
    ```
    This way we can optionally update quary with image URL

## Frontend Changes
### **!Not Implemented Yet!**
- Enhanced the badge creation and editing forms to include an input field for points.
- Updated the badge listing page to display the points alongside badge titles.

## Testing


### Database testing
To ensure that everything is working correctly, you can run:

```sql
SELECT * FROM badges_list;  -- This retrieves all records from the badges_list table.
```

### Additional Tests

#### Insertion Test
Test adding a badge with points:

```sql
INSERT INTO badges_list (title, description, points) VALUES ('new-badge', 'Test badge', 50);
SELECT * FROM badges_list WHERE title = 'new-badge';  -- Checks if the insertion works correctly with the points column.
```

#### Boundary Condition Test
Test adding points at the boundary of the allowed range (0 and 100):

```sql
INSERT INTO badges_list (title, description, points) VALUES ('zero-point-badge', 'This badge has zero points', 0);
INSERT INTO badges_list (title, description, points) VALUES ('hundred-point-badge', 'This badge has a hundred points', 100);
```

#### Invalid Insertion Test
Test adding points that are out of range (e.g., -1 and 101):

```sql
INSERT INTO badges_list (title, description, points) VALUES ('negative-point-badge', 'This should fail', -1); 
INSERT INTO badges_list (title, description, points) VALUES ('over-hundred-point-badge', 'This should fail too', 101);
```

#### Update Test
Test updating an existing badge's points:

```sql
UPDATE badges_list SET points = 25 WHERE title = 'new-badge';
SELECT * FROM badges_list WHERE title = 'new-badge';  -- Check if the update worked.
```

### API Calls Testing


#### POST Method Test
- Test happy path
- Test no points value
- Test out of boundaries points value

```bash
http POST http://localhost:5000/badges Content-Type:application/json title="New Badge" description="POST test" points:=10 
# Points in boundaries
```
```bash
http POST http://localhost:5000/badges Content-Type:application/json title="New Badge" description="POST test" 
# By default, points got set to 0
```
```bash
http POST http://localhost:5000/badges Content-Type:application/json title="New Badge" description="POST test" points:=110 
# {"error": "Points must be a number between 0 and 100."}
```
#### PUT Method Test
```bash
http PUT http://localhost:5000/badges/1 Content-Type:application/json title="Updated Badge" description="Updated description" points:=50 
# Points in boundaries
```
```bash
http PUT http://localhost:5000/badges/1 Content-Type:application/json title="Updated Badge" description="Updated description" points:=150 
# {"error": "Points must be a number between 0 and 100."}
```
```bash
http PUT http://localhost:5000/badges/1 Content-Type:application/json title="Updated Badge" description="Updated description" 
# Existing points should remain unchanged
```
