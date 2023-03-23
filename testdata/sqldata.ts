export const removeCorp = `
DELETE FROM public."Corporation" WHERE id = 'testcorp';
`;

export const removeTable = `
DELETE FROM public."Desk";
`;

export const addCorp = `
INSERT INTO public."Corporation" (id, name) VALUES ('testcorp', 'Test Corporate');
`;

export const addTable = `
INSERT INTO public."Desk" (table_name, is_occupied, corporation_id) 
VALUES 
    ('TS01', false, 'testcorp'),
    ('TS02', false, 'testcorp'),
    ('TS03', false, 'testcorp'),
    ('TS04', false, 'testcorp'),
    ('TS05', false, 'testcorp'),
    ('TS06', false, 'testcorp'),
    ('TS07', false, 'testcorp'),
    ('TS08', false, 'testcorp'),
    ('TS09', false, 'testcorp'),
    ('TS10', false, 'testcorp'),
    ('TS11', false, 'testcorp'),
    ('TS12', false, 'testcorp'),
    ('TS13', false, 'testcorp'),
    ('TS14', false, 'testcorp'),
    ('TS15', false, 'testcorp'),
    ('TS16', false, 'testcorp'),
    ('TS17', false, 'testcorp'),
    ('TS18', false, 'testcorp')
;
`;
