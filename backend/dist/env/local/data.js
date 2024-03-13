"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    sys: {
        user: {
            u01: {
                'entity$': '-/sys/user',
                name: 'Alice',
                email: 'alice@example.com',
                // pass="alice123"
                pass: '4b46730c5dfbf3c3b8a688689825edd64109eb18b2b64a815638e85137c5a96dec28e679f1463745e216ccd8fe305a62ee279e547b3807924fb4a8e9c485f30d',
                handle: 'alice',
                active: true,
                verified: true,
                sv: 1,
                salt: 'd2a3249e67d6f8d63c25376ee038cf95',
                id: 'u01'
            },
            u02: {
                'entity$': '-/sys/user',
                name: 'Bob',
                email: 'bob@example.com',
                // pass="alice123"
                pass: '4b46730c5dfbf3c3b8a688689825edd64109eb18b2b64a815638e85137c5a96dec28e679f1463745e216ccd8fe305a62ee279e547b3807924fb4a8e9c485f30d',
                handle: 'bob',
                active: true,
                verified: true,
                sv: 1,
                salt: 'd2a3249e67d6f8d63c25376ee038cf95',
                id: 'u02'
            },
            u03: {
                'entity$': '-/sys/user',
                name: 'Cathy',
                email: 'cathy@example.com',
                // pass="alice123"
                pass: '4b46730c5dfbf3c3b8a688689825edd64109eb18b2b64a815638e85137c5a96dec28e679f1463745e216ccd8fe305a62ee279e547b3807924fb4a8e9c485f30d',
                handle: 'cathy',
                active: true,
                verified: true,
                sv: 1,
                salt: 'd2a3249e67d6f8d63c25376ee038cf95',
                id: 'u03'
            },
            u04: {
                'entity$': '-/sys/user',
                name: 'Dave',
                email: 'dave@example.com',
                // pass="alice123"
                pass: '4b46730c5dfbf3c3b8a688689825edd64109eb18b2b64a815638e85137c5a96dec28e679f1463745e216ccd8fe305a62ee279e547b3807924fb4a8e9c485f30d',
                handle: 'dave',
                active: true,
                verified: true,
                sv: 1,
                salt: 'd2a3249e67d6f8d63c25376ee038cf95',
                id: 'u04'
            },
            u05: {
                'entity$': '-/sys/user',
                name: 'Emma',
                email: 'emma@example.com',
                // pass="alice123"
                pass: '4b46730c5dfbf3c3b8a688689825edd64109eb18b2b64a815638e85137c5a96dec28e679f1463745e216ccd8fe305a62ee279e547b3807924fb4a8e9c485f30d',
                handle: 'emma',
                active: true,
                verified: true,
                sv: 1,
                salt: 'd2a3249e67d6f8d63c25376ee038cf95',
                id: 'u05'
            },
        },
        login: {
            poqouc: {
                'entity$': '-/sys/login',
                token: '95eb75da-8795-4ed2-9095-ae4437d4054d',
                handle: 'alice',
                email: 'alice@example.com',
                user_id: 'u01',
                when: '2022-07-14T22:06:23.387Z',
                active: true,
                why: 'pass',
                sv: 1,
                id: 'poqouc'
            }
        }
    },
    pdm: {
        podcast: {
            'r2d56q': {
                'entity$': '-/pdm/podcast',
                feed: 'https://feeds.resonaterecordings.com/voxgig-fireside-podcast',
                title: 'Fireside with Voxgig',
                earmark: 'voxgigfireside',
                desc: '\n' +
                    '            This DevRel focused podcast allows entrepreneur, author and coder Richard Rodger introduce you to interesting leaders and experienced professionals in the tech community. Richard and his guests chat not just about their current work or latest trend, but also about their experiences, good and bad, throughout their career. DevRel requires so many different skills and you can come to it from so many routes, that this podcast has featured conference creators, entrepreneurs, open source maintainers, developer advocates and community managers. Join us to learn about just how varied DevRel can be and get ideas to expand your work, impact and community.\n' +
                    '        ',
                t_m: 1705428262299,
                t_mh: 2024011618042230,
                t_c: 1705428262299,
                t_ch: 2024011618042230,
                id: 'r2d56q'
            },
        },
        episode: {
            'm3kg85': {
                'entity$': '-/pdm/episode',
                podcast_id: 'r2d56q',
                guid: 'e2af4a39-acaf-4c72-a4fa-816d712e3465',
                title: 'Episode 157, Liz Acosta, Developer Content Marketing Manager for Streamlit',
                link: '',
                pubDate: 'Thu, 07 Mar 2024 07:00:00 +0000',
                content: '\n' +
                    '                The wonderful Liz Acosta joins us on this episode of the podcast for a slightly philosophical chat on community, the different iterations of DevRel, and why we as humans will always gravitate to the things we perceive as “real”.\r\n' +
                    '\r\n' +
                    'Liz is the new Developer Content Marketing Manager for Streamlit at Snowflake, and this provides us with a wonderful opportunity to learn from someone right in the process of determining their role in an organisation! Liz talks to us about her plans for Streamlit, all of which centre connection and community heavily.\r\n' +
                    '\r\n' +
                    'As someone who has worked heavily in DevRel, Liz has no intentions of abandoning the Developer Advocates at Streamlit to fend for themselves, and her passion for connecting with people is more than clear.\r\n' +
                    '\r\n' +
                    'Liz tells us all about the evolution of DevRel, and why she believes increased regulation and codifying of previously informal guidelines is a good thing. Not only that, but for those of you who enjoy a good philosophical discussion, she explains that while we all appreciate things that are “real”, the not-so-real can be just as valuable. Whether that be AI generated copy, or an artist who lip-syncs their way through a concert!\r\n' +
                    '\r\n' +
                    'Reach out to Liz here: https://www.linkedin.com/in/lizacostalinkedin/\r\n' +
                    '\r\n' +
                    'Find out more and listen to previous podcasts here: https://www.voxgig.com/podcast\r\n' +
                    '\r\n' +
                    'Subscribe to our newsletter for weekly updates and information about upcoming meetups: \r\n' +
                    'https://voxgig.substack.com/\r\n' +
                    '\r\n' +
                    'Join the Dublin DevRel Meetup group here: www.devrelmeetup.com\n' +
                    '            ',
                url: 'https://media.resonaterecordings.com/voxgig-fireside-podcast/e2af4a39-acaf-4c72-a4fa-816d712e3465.mp3',
                batch: 'B2024030714121283',
                episode: '{"title":"Episode 157, Liz Acosta, Developer Content Marketing Manager for Streamlit","link":"","pubDate":"Thu, 07 Mar 2024 07:00:00 +0000","enclosure":{"url":"https://media.resonaterecordings.com/voxgig-fireside-podcast/e2af4a39-acaf-4c72-a4fa-816d712e3465.mp3","length":"66382040","type":"audio/mpeg"},"content":"\\n                The wonderful Liz Acosta joins us on this episode of the podcast for a slightly philosophical chat on community, the different iterations of DevRel, and why we as humans will always gravitate to the things we perceive as “real”.\\r\\n\\r\\nLiz is the new Developer Content Marketing Manager for Streamlit at Snowflake, and this provides us with a wonderful opportunity to learn from someone right in the process of determining their role in an organisation! Liz talks to us about her plans for Streamlit, all of which centre connection and community heavily.\\r\\n\\r\\nAs someone who has worked heavily in DevRel, Liz has no intentions of abandoning the Developer Advocates at Streamlit to fend for themselves, and her passion for connecting with people is more than clear.\\r\\n\\r\\nLiz tells us all about the evolution of DevRel, and why she believes increased regulation and codifying of previously informal guidelines is a good thing. Not only that, but for those of you who enjoy a good philosophical discussion, she explains that while we all appreciate things that are “real”, the not-so-real can be just as valuable. Whether that be AI generated copy, or an artist who lip-syncs their way through a concert!\\r\\n\\r\\nReach out to Liz here: https://www.linkedin.com/in/lizacostalinkedin/\\r\\n\\r\\nFind out more and listen to previous podcasts here: https://www.voxgig.com/podcast\\r\\n\\r\\nSubscribe to our newsletter for weekly updates and information about upcoming meetups: \\r\\nhttps://voxgig.substack.com/\\r\\n\\r\\nJoin the Dublin DevRel Meetup group here: www.devrelmeetup.com\\n            ","contentSnippet":"The wonderful Liz Acosta joins us on this episode of the podcast for a slightly philosophical chat on community, the different iterations of DevRel, and why we as humans will always gravitate to the things we perceive as “real”.\\r\\n\\r\\nLiz is the new Developer Content Marketing Manager for Streamlit at Snowflake, and this provides us with a wonderful opportunity to learn from someone right in the process of determining their role in an organisation! Liz talks to us about her plans for Streamlit, all of which centre connection and community heavily.\\r\\n\\r\\nAs someone who has worked heavily in DevRel, Liz has no intentions of abandoning the Developer Advocates at Streamlit to fend for themselves, and her passion for connecting with people is more than clear.\\r\\n\\r\\nLiz tells us all about the evolution of DevRel, and why she believes increased regulation and codifying of previously informal guidelines is a good thing. Not only that, but for those of you who enjoy a good philosophical discussion, she explains that while we all appreciate things that are “real”, the not-so-real can be just as valuable. Whether that be AI generated copy, or an artist who lip-syncs their way through a concert!\\r\\n\\r\\nReach out to Liz here: https://www.linkedin.com/in/lizacostalinkedin/\\r\\n\\r\\nFind out more and listen to previous podcasts here: https://www.voxgig.com/podcast\\r\\n\\r\\nSubscribe to our newsletter for weekly updates and information about upcoming meetups: \\r\\nhttps://voxgig.substack.com/\\r\\n\\r\\nJoin the Dublin DevRel Meetup group here: www.devrelmeetup.com","guid":"e2af4a39-acaf-4c72-a4fa-816d712e3465","isoDate":"2024-03-07T07:00:00.000Z","itunes":{"subtitle":"The wonderful Liz Acosta joins us on this episode of the podcast for a slightly philosophical chat on community, the different iterations of DevRel, and why we as humans will always gravitate to th...","explicit":"false","duration":"2055","episode":"157","season":"6","episodeType":"full"}}',
                t_m: 1709820738493,
                t_mh: 2024030714121849,
                t_c: 1709819926783,
                t_ch: 2024030713584678,
                id: 'm3kg85',
                guest: 'Liz Acosta',
                topics: [
                    'community',
                    'the evolution of DevRel',
                    'the value of real vs imposters'
                ],
                links: [
                    {
                        url: 'https://www.linkedin.com/in/lizacostalinkedin/',
                        text: 'Liz Acosta LinkedIn'
                    },
                    { url: 'https://www.voxgig.com/podcast', text: 'VoxGig Podcast' },
                    { url: 'https://voxgig.substack.com/', text: 'VoxGig Newsletter' },
                    {
                        url: 'https://www.devrelmeetup.com/',
                        text: 'Dublin DevRel Meetup'
                    }
                ]
            }
        },
    }
};
//# sourceMappingURL=data.js.map