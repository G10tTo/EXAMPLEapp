# App Enhancements

## S[17] Backend Database and API Feature: Modified At Date Feature Implementation by @G10tTo - Andrea Sargiotto

- This pull request introduces implementation of the "modified at (date)" feature.

## Database Changes
- **Updated Column**: The `badges_list` table includes a column for tracking modifications:
  - `modified_date TIMESTAMPTZ DEFAULT NULL`
- This allows storing the time when a badge is last modified, and defaults to `NULL` when the badge has never been edited.

## Backend Changes
- **Sorting Logic**: Introduced logic to handle sorting badges based on their modification date in ascending (Oldest), descending (Most Recent), and default order.
    - Added a query parameter `sort` in the `GET /badges` route to sort badges based on their `modified_date`.
    - Possible values for `sort`:
      - `asc`: Sorts badges by `modified_date` in ascending order (Oldest).
      - `desc`: Sorts badges by `modified_date` in descending order (Most Recent).
      - Default state: No sorting applied (badges are returned in the default insertion order).
  
- **Modified PUT Method**: The `PUT /badges/:id` method now updates the `modified_date` column to the current timestamp (`NOW()`).
    - This ensures that every time a badge is edited, the `modified_date` reflects the time of the change.

#### Additional Comment:
- For the `GET /badges` route, the sorting mechanism works by appending an `ORDER BY` clause to the SQL query, depending on the value of the `sort` parameter:
    ```javascript
    let query = 'SELECT * FROM badges_list';
    if (sort === 'asc') {
        query += ' ORDER BY modified_date ASC';
    } else if (sort === 'desc') {
        query += ' ORDER BY modified_date DESC';
    }
    ```

## Frontend Changes
- A button next to the "Modified At" column header to allow the user to toggle between:
    - Default state (no sorting) -> `↕`
    - Ascending order (Oldest first) -> `↑`
    - Descending order (Most Recent first) -> `↓`
- When clicked, the button will change its icon to indicate the sorting direction: `↕` for no sorting, `↑` for ascending, and `↓` for descending.


## Testing
Here's a detailed set of tests to validate the **modified_date** feature:

## Testing

### Database testing
To ensure the database structure and functionality for the `modified_date` are working correctly, use the following queries:

#### Check the Structure and Data
```sql
SELECT * FROM badges_list;  -- This retrieves all records from the badges_list table, showing the modified_date for each.
```

#### Verify NULL as Default for Modified Date
Insert a new badge and verify that `modified_date` is NULL initially:
```sql
INSERT INTO badges_list (title, description, points) VALUES ('test-badge', 'Badge with no modification', 10);
SELECT * FROM badges_list WHERE title = 'test-badge';  -- modified_date should be NULL at this point.
```

### Additional Tests

#### Update and Validate Modified Date
After updating a badge, check if the `modified_date` is set to the current timestamp:
```sql
UPDATE badges_list SET description = 'Updated description' WHERE title = 'test-badge';
SELECT modified_date FROM badges_list WHERE title = 'test-badge';  -- modified_date should now show the current timestamp.
```

#### Ensure `modified_date` Remains Unchanged on No Update
If the user cancels the edit or submits without any changes, `modified_date` should not be altered:
```sql
UPDATE badges_list SET description = 'Updated description' WHERE title = 'test-badge';  -- Perform the same update twice.
SELECT modified_date FROM badges_list WHERE title = 'test-badge';  -- The timestamp should remain the same.
```

#### Sorting Test for Modified Date
Test sorting badges by `modified_date` in ascending and descending order using a SQL query:
```sql
SELECT * FROM badges_list ORDER BY modified_date ASC;  -- Badges sorted by oldest modification first.
SELECT * FROM badges_list ORDER BY modified_date DESC;  -- Badges sorted by most recent modification first.
```

### API Calls Testing

#### POST Method Test (No Modified Date)
When creating a new badge, the `modified_date` should be `NULL`:
```bash
http POST http://localhost:5000/badges Content-Type:application/json title="New Badge" description="Testing badge creation"
# Check if modified_date is NULL initially
```

#### PUT Method Test (Set Modified Date)
After updating a badge, the `modified_date` should reflect the current time:
```bash
http PUT http://localhost:5000/badges/1 Content-Type:application/json title="Updated Title" description="Updated description"
# modified_date should now be set to the current timestamp
```

#### PUT Method Test (No Change to Modified Date)
If the update is performed without actual changes, `modified_date` should remain the same:
```bash
http PUT http://localhost:5000/badges/1 Content-Type:application/json title="Updated Title" description="Updated description"
# modified_date should remain unchanged if no real update occurs
```

#### GET Method Test (Sort by Modified Date)
Test the sorting functionality by retrieving badges in ascending and descending order:
```bash
http GET http://localhost:5000/badges?sort=asc  # Sort badges by oldest modification date
http GET http://localhost:5000/badges?sort=desc # Sort badges by most recent modification date
```

These tests should cover the key aspects of the **modified_date** feature, ensuring correct behavior when creating, updating, and sorting badges.