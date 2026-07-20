#module Mockup;

// Stores the sendet news for a more realistic behavior, because the sendet
// records are then temporarily removed when changing data types and searching.
const storage = [];

const Mockup = {
    filterRecords(datatype, records) {

        // makes the date in the example more plausible/realistic
        const day = 24 *60 * 60 *1000;
        const now = new Date().getTime();
        records.forEach((record, index) => {
            const timestamp = new Date(now - (((index *index *1.5) -index +3) *day));
            record.timestamp = timestamp.toISOString().split('T')[0];
        });

        // filter the already sent records but ignore groups
        records = records.filter((record) =>
            !storage.includes(record.id)
                && (record.datatype !== 2
                        || datatype === 2));

        // filter empty groups
        if (datatype !== 2) {
            records = records.filter((record, index, array) =>
                record.datatype !== 2
                    || datatype === 2
                    || (index < array.length() -1
                            && array[index +1].datatype !== 2));
        }

        return records;
    },
    sendNewsletter(mode, recipients, recordIds) {

        // With the macro #export FUNCTION_PUBLISH in news.js the constant(s)
        // can be used here as well.
        if (mode == FUNCTION_PUBLISH)
            storage.push(...(recordIds || []));

        let size = 10;
        if (mode === 1)
            size = 1;
        if (mode === 2)
            size = 0;
        const response = {mode, recipients:[]};
        (recipients || []).forEach(recipient =>
            response.recipients.push(recipient));
        if (mode !== 2)
            response.recipients = [];
        if (mode === 1)
            response.recipients.push("morten.menigmand@example.local");
        while (response.recipients.length < size)
            response.recipients.push("x***.x******@example.local");
        response.recipients = response.recipients.map(recipient => {
            return {
                language: "en",
                email: recipient,
                permissions: ["A01", "B01", "C03"],
                markets: ["AN", "EU"]
            };
        });
        return response;
    }
};

#export Mockup;