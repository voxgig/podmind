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

      'caed07': {
        'entity$': '-/pdm/episode',
        podcast_id: 'r2d56q',
        guid: '8a83a872-6db3-47b6-8643-ea5d33f7f6d9',
        title: '8a83a872-6db3-47b6-8643-ea5d33f7f6d9',
        link: '',
        pubDate: 'Tue, 19 Dec 2023 08:00:00 +0000',
        content: '\n' +
          "                Webre taking a deep dive into the history of Node with this episodebs guest, Charlie Robbins. Charlie isn't just a greatly experienced engineer, who now lends his advice and consultancy skills to others - he was also one of the earliest adopters of Node, and is uniquely placed to give us a lesson not just in history, but also in the unique factors that gave Node the dominance it now holds.\r\n" +
          '\r\n' +
          'So how did Node take over the world? Well unlike movie supervillains, it wasnbt with a ray gun or a mind control serum, it was by being really good at what they did in the face of competitors asleep at the wheel, a natural selection process to which Charlie had a front row seat.\r\n' +
          '\r\n' +
          'Charlie went into financial services in the wake of the financial crash, when most people had either been pushed or jumped off that ship, but because of his knowledge of a brand new service called Node, he ended up working with people ten years his senior to figure out this new frontier.\r\n' +
          '\r\n' +
          'Charlie speaks about the conflation of jobs like accountants with engineers. People tend to think engineering is purely a numbers game, but as many will tell you, engineers are often brimming with creativity, and the variable is whether or not their boss will let them express it.\r\n' +
          '\r\n' +
          'This is a great discussion on how small actions can lead to big waves.\n' +
          '            ',
        url: 'https://media.resonaterecordings.com/voxgig-fireside-podcast/8a83a872-6db3-47b6-8643-ea5d33f7f6d9.mp3',
        t_m: 1705428263214,
        t_mh: 2024011618042321,
        t_c: 1705428263214,
        t_ch: 2024011618042321,
        id: 'caed07'
      },
      '7x0cz4': {
        'entity$': '-/pdm/episode',
        podcast_id: 'r2d56q',
        guid: '8e5e22e6-5d5f-477d-8635-c8e6a372a6b0',
        title: '8e5e22e6-5d5f-477d-8635-c8e6a372a6b0',
        link: '',
        pubDate: 'Thu, 14 Dec 2023 05:00:00 +0000',
        content: '\n' +
          '                The practice of DevRel is something that can vary hugely amongst those who engage in it, so itbs always fascinating to see how different companies approach DevRel. In this episode, webre speaking to Liran Tal, director of developer advocacy at Snyk, about how his team makes use of DevRel.\r\n' +
          '\r\n' +
          'Liran is a big believer in empathy, and infuses it into every aspect of his developer advocacy work. Itbs a theme that has come up repeatedly on the podcast recently, and Liran is another proponent of empathy being at the centre of how we engage with developers.\r\n' +
          '\r\n' +
          'Like many people, Liran came through the engineering pipeline, and made the jump to DevRel when he started at Snyk, but he explains why this bjumpb was actually more of a step, as he had already used his engineering work to initiate community events and public speaking opportunities, so DevRel felt like a natural place to take those skills.\r\n' +
          '\r\n' +
          'As an engineer using JavaScript and open source, Liran began to see the immense value of a hive-like community, connecting hundreds, or thousands of people to collaborate and share information, and he knew he wanted to live in that space. And luckily, as he explains, no one needs permission to start being a DevRel. No matter what specific area you work in, you can stealthily start practising public speaking, or building communities, and then when youbre ready to officially start looking for that DevRel job, youbll already have some idea of what youbre doing.\r\n' +
          '\r\n' +
          'Liran speaks about the bDevRelb ladder, and the common question of how those who want to can climb it. DevRel is one of those fields with endless room to grow. You may start out knowing nothing about the technical side, and end up with a whole new set of skills that are now available to you. But for most of us, the ladder thing is secondary to doing something youbre really passionate about, and speaking to Liran has only increased that passion for us here at Voxgig.\r\n' +
          '\r\n' +
          'Reach out to Liran here: https://www.linkedin.com/in/talliran/\r\n' +
          '\r\n' +
          'Find out more and listen to previous podcasts here: https://www.voxgig.com/podcast\r\n' +
          '\r\n' +
          'Subscribe to our newsletter for weekly updates and information about upcoming meetups: https://voxgig.substack.com/\r\n' +
          'Join the Dublin DevRel Meetup group here: www.devrelmeetup.com\n' +
          '            ',
        url: 'https://media.resonaterecordings.com/voxgig-fireside-podcast/8e5e22e6-5d5f-477d-8635-c8e6a372a6b0.mp3',
        t_m: 1705428263225,
        t_mh: 2024011618042322,
        t_c: 1705428263225,
        t_ch: 2024011618042322,
        id: '7x0cz4'
      }

    }
  },

  /*
  pdm: {
    podcast: {
      'i9hu8e': {
        'entity$': '-/pdm/podcast',
        feed: 'https://feeds.resonaterecordings.com/voxgig-fireside-podcast',
        title: 'Fireside with Voxgig',
        desc: '\n' +
          '            This DevRel focused podcast allows entrepreneur, author and coder Richard Rodger introduce you to interesting leaders and experienced professionals in the tech community. Richard and his guests chat not just about their current work or latest trend, but also about their experiences, good and bad, throughout their career. DevRel requires so many different skills and you can come to it from so many routes, that this podcast has featured conference creators, entrepreneurs, open source maintainers, developer advocates and community managers. Join us to learn about just how varied DevRel can be and get ideas to expand your work, impact and community.\n' +
          '        ',
        t_m: 1704887323228,
        t_mh: 2024011011484322,
        t_c: 1704887323228,
        t_ch: 2024011011484322,
        id: 'i9hu8e'
      }
    },
    episode: {
      '73c1jp': {
        'entity$': '-/pdm/episode',
        podcast_id: 'i9hu8e',
        guid: '8a83a872-6db3-47b6-8643-ea5d33f7f6d9',
        title: '8a83a872-6db3-47b6-8643-ea5d33f7f6d9',
        link: '',
        pubDate: 'Tue, 19 Dec 2023 08:00:00 +0000',
        content: '\n' +
          "                Webre taking a deep dive into the history of Node with this episodebs guest, Charlie Robbins. Charlie isn't just a greatly experienced engineer, who now lends his advice and consultancy skills to others - he was also one of the earliest adopters of Node, and is uniquely placed to give us a lesson not just in history, but also in the unique factors that gave Node the dominance it now holds.\r\n" +
          '\r\n' +
          'So how did Node take over the world? Well unlike movie supervillains, it wasnbt with a ray gun or a mind control serum, it was by being really good at what they did in the face of competitors asleep at the wheel, a natural selection process to which Charlie had a front row seat.\r\n' +
          '\r\n' +
          'Charlie went into financial services in the wake of the financial crash, when most people had either been pushed or jumped off that ship, but because of his knowledge of a brand new service called Node, he ended up working with people ten years his senior to figure out this new frontier.\r\n' +
          '\r\n' +
          'Charlie speaks about the conflation of jobs like accountants with engineers. People tend to think engineering is purely a numbers game, but as many will tell you, engineers are often brimming with creativity, and the variable is whether or not their boss will let them express it.\r\n' +
          '\r\n' +
          'This is a great discussion on how small actions can lead to big waves.\n' +
          '            ',
        url: 'https://media.resonaterecordings.com/voxgig-fireside-podcast/8a83a872-6db3-47b6-8643-ea5d33f7f6d9.mp3',
        t_m: 1704887323534,
        t_mh: 2024011011484353,
        t_c: 1704887323534,
        t_ch: 2024011011484353,
        id: '73c1jp'
      },
    },
    },
    */
}
