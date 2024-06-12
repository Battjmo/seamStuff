WITH
challenges_complete  (hacker_id, challenge_count)
AS (
    SELECT
    hackers.hacker_id, COUNT(challenge_id) AS challenge_count
    FROM
    hackers
    INNER JOIN
    challenges
    ON
    hackers.hacker_id = challenges.hacker_id
    GROUP BY
    hackers.hacker_id
    ORDER BY
    challenge_count DESC
)

SELECT
challenges_complete.hacker_id, hackers.name, challenges_complete.challenge_count
FROM
challenges_complete
INNER JOIN
hackers
ON
hackers.hacker_id = challenges_complete.hacker_id
GROUP BY
challenges_complete.hacker_id, hackers.name
HAVING
challenge_count IN (SELECT MAX(challenge_count) from challenges_complete)
OR
challenge_count IN (SELECT challenge_count FROM challenges_complete GROUP BY challenge_count HAVING COUNT(challenge_count) = 1)
ORDER BY
challenge_count desc, hacker_id
