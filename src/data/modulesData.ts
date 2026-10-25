import { MathModule } from '../types/math';

export const MODULES_DATA: MathModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Integer Concepts',
    themeColor: '#3b82f6',
    icon: 'compass',
    description: 'Explore positive and negative numbers, opposites, absolute values, and real-world temperature & elevation comparisons.',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Lesson 1.1: Understand Positive & Negative Numbers',
        description: 'Explore numbers on a line, zero as reference, real-world context, and opposites.',
        questions: [
          {
            id: 'm1-l1-q1',
            moduleId: 'module-1',
            lessonId: 'lesson-1-1',
            lessonTitle: 'Understand Positive & Negative Numbers',
            prompt: 'An investment gains $5 in value on one day. The next day, it loses $3 in value. Represent each of these using integers.',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '$5 and -$3' },
              { id: 'b', text: '-$5 and $3' },
              { id: 'c', text: '$5 and $3' },
              { id: 'd', text: '-$5 and -$3' }
            ],
            correctAnswer: 'a',
            explanation: 'A gain is represented by a positive integer (+5 or 5), and a loss is represented by a negative integer (-3).',
            hint: 'Think of gain as moving right/up (positive) and loss as moving left/down (negative).',
            funnySuccessLine: 'Ka-ching! Your integer bank account is booming!',
            funnyFailLine: 'Oops! Watch out for the minus sign gremlin!',
            sourcePage: 'Page 8 Check Understanding #1',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l1-q2',
            moduleId: 'module-1',
            lessonId: 'lesson-1-1',
            lessonTitle: 'Understand Positive & Negative Numbers',
            prompt: 'What is the opposite of the integer -8?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-8' },
              { id: 'b', text: '8' },
              { id: 'c', text: '0' },
              { id: 'd', text: '-1/8' }
            ],
            correctAnswer: 'b',
            explanation: 'Opposites are the same distance from 0 on the number line but on opposite sides. The opposite of -8 is 8.',
            hint: 'Find the number on the other side of 0 that is exactly 8 steps away.',
            funnySuccessLine: 'Opposite Day champion! 8 steps to victory!',
            funnyFailLine: 'Not quite! Opposites flip across zero!',
            sourcePage: 'Page 8 Check Understanding #4',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l1-q3',
            moduleId: 'module-1',
            lessonId: 'lesson-1-1',
            lessonTitle: 'Understand Positive & Negative Numbers',
            prompt: 'Jose collects baseball cards. Over the last year, the change in the value of his favorite card is -$7. Which best describes the meaning of this integer?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'The card is now worth $7.' },
              { id: 'b', text: 'The value of the card has increased by $7.' },
              { id: 'c', text: 'The value of the card has decreased by $7.' },
              { id: 'd', text: 'The card is now worth -$7.' }
            ],
            correctAnswer: 'c',
            explanation: 'A negative change in value indicates that the value went down (decreased) by $7.',
            hint: 'A minus sign on a value change means a drop or decrease.',
            funnySuccessLine: 'Home run! Jose salutes your baseball math acumen!',
            funnyFailLine: 'Strike one! Think about what negative change means.',
            sourcePage: 'Page 12 Test Prep #8',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l1-q4',
            moduleId: 'module-1',
            lessonId: 'lesson-1-1',
            lessonTitle: 'Understand Positive & Negative Numbers',
            prompt: 'Which situations can be represented by -8? Select all that apply.',
            type: 'multi_select',
            options: [
              { id: 'a', text: 'A temperature drop of 8 °F' },
              { id: 'b', text: 'A depth of 8 meters' },
              { id: 'c', text: 'A growth of 8 centimeters' },
              { id: 'd', text: 'A time 8 years ago' },
              { id: 'e', text: 'A loss of 8 pounds' },
              { id: 'f', text: 'A gain of $8' }
            ],
            correctAnswer: ['a', 'b', 'd', 'e'],
            explanation: 'Drops, depths below surface, past time, and losses represent negative quantities (-8). Growth and gains represent positive (+8).',
            hint: 'Look for words that mean decreasing, below ground, in the past, or losing.',
            funnySuccessLine: 'Multi-select superhero! You caught all 4 negative situations!',
            funnyFailLine: 'Careful! Growth and gains are positive vibes only!',
            sourcePage: 'Page 12 Test Prep #12',
            difficulty: 'medium',
            points: 150
          },
          {
            id: 'm1-l1-q5',
            moduleId: 'module-1',
            lessonId: 'lesson-1-1',
            lessonTitle: 'Understand Positive & Negative Numbers',
            prompt: 'Last week, Tiana\'s time spent running decreased by 2 minutes. This week, her time spent running increased by 1 minute. What integers represent these changes?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-2 and 1' },
              { id: 'b', text: '2 and -1' },
              { id: 'c', text: '-2 and -1' },
              { id: 'd', text: '2 and 1' }
            ],
            correctAnswer: 'a',
            explanation: 'Decreased by 2 minutes is -2. Increased by 1 minute is +1 (or 1).',
            hint: 'Decrease = negative (-), increase = positive (+).',
            funnySuccessLine: 'Running circles around math problems!',
            funnyFailLine: 'Tiana paused her stopwatch to let you recalculate!',
            sourcePage: 'Page 33 On Your Own #7 & #8',
            difficulty: 'easy',
            points: 100
          }
        ]
      },
      {
        id: 'lesson-1-2',
        title: 'Lesson 1.2: Compare & Order Integers on a Number Line',
        description: 'Compare values, determine coldest to warmest, and order elevations.',
        questions: [
          {
            id: 'm1-l2-q1',
            moduleId: 'module-1',
            lessonId: 'lesson-1-2',
            lessonTitle: 'Compare & Order Integers on a Number Line',
            prompt: 'The table shows the elevations above or below sea level of several lakes: Beldon Lake (-18.5 ft), Forest Lake (90 ft), Springbrook Lake (-75.2 ft). Which lake is at a lower elevation: Springbrook Lake or Forest Lake?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Springbrook Lake, because -75.2 is to the left of 90 on the number line.' },
              { id: 'b', text: 'Forest Lake, because 90 is higher than 0.' },
              { id: 'c', text: 'They are at the same elevation.' },
              { id: 'd', text: 'Springbrook Lake, because -75.2 is positive.' }
            ],
            correctAnswer: 'a',
            explanation: '-75.2 is to the left of 90 on a horizontal number line, so -75.2 < 90. Springbrook Lake is at a lower elevation.',
            hint: 'On a vertical or horizontal number line, negative numbers are below or to the left of positive numbers.',
            funnySuccessLine: 'Splashing into success! Springbrook is super deep!',
            funnyFailLine: 'Careful! Don\'t get soaked by comparing backwards!',
            sourcePage: 'Page 14 Build Understanding #1D',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l2-q2',
            moduleId: 'module-1',
            lessonId: 'lesson-1-2',
            lessonTitle: 'Compare & Order Integers on a Number Line',
            prompt: 'Tanner (-1), Caleb (2), Lamar (-2), and Tammy (1) play disc golf and record scores relative to par. Which choice shows their scores in order from LEAST to GREATEST?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-1, 2, -2, 1' },
              { id: 'b', text: '-1, -2, 1, 2' },
              { id: 'c', text: '2, 1, -1, -2' },
              { id: 'd', text: '-2, -1, 1, 2' }
            ],
            correctAnswer: 'd',
            explanation: 'On the number line from left to right: -2 < -1 < 1 < 2. Lamar (-2), Tanner (-1), Tammy (1), Caleb (2).',
            hint: 'The most negative number is the smallest (least).',
            funnySuccessLine: 'Hole-in-one! Perfect disc golf order!',
            funnyFailLine: 'The disc flew into the bushes! Remember: -2 is less than -1!',
            sourcePage: 'Page 20 Test Prep #7',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm1-l2-q3',
            moduleId: 'module-1',
            lessonId: 'lesson-1-2',
            lessonTitle: 'Compare & Order Integers on a Number Line',
            prompt: 'Order the morning temperatures from coldest to warmest: -8 °F, -2 °F, -11 °F, 0 °F.',
            type: 'ordering',
            options: [
              { id: 'opt1', text: '-11 °F' },
              { id: 'opt2', text: '-8 °F' },
              { id: 'opt3', text: '-2 °F' },
              { id: 'opt4', text: '0 °F' }
            ],
            correctAnswer: ['opt1', 'opt2', 'opt3', 'opt4'],
            explanation: '-11 °F is the coldest (furthest left), followed by -8 °F, -2 °F, and 0 °F is warmest.',
            hint: 'Coldest means lowest number on the thermometer.',
            funnySuccessLine: 'Brrr! Shivering with mathematical precision!',
            funnyFailLine: 'Check your frostbite meter! -11 is colder than -8!',
            sourcePage: 'Page 17 On Your Own #3D',
            difficulty: 'medium',
            points: 150
          },
          {
            id: 'm1-l2-q4',
            moduleId: 'module-1',
            lessonId: 'lesson-1-2',
            lessonTitle: 'Compare & Order Integers on a Number Line',
            prompt: 'An office building uses positive and negative numbers for floors. Nathan is going to floor 1, and Eva is going to floor -1. Who is going to the higher floor?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Nathan (1 > -1)' },
              { id: 'b', text: 'Eva (-1 > 1)' },
              { id: 'c', text: 'Both are on the same floor' },
              { id: 'd', text: 'Neither, lobby is higher' }
            ],
            correctAnswer: 'a',
            explanation: 'Floor 1 is above the lobby (ground floor 0), whereas floor -1 is below the lobby. 1 > -1.',
            hint: 'Positive floors go up, negative floors are underground.',
            funnySuccessLine: 'Going up! Ding! Penthouse mathematician!',
            funnyFailLine: 'Stuck in the elevator! 1 is higher than -1!',
            sourcePage: 'Page 19 Lesson 1.2 #3',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l2-q5',
            moduleId: 'module-1',
            lessonId: 'lesson-1-2',
            lessonTitle: 'Compare & Order Integers on a Number Line',
            prompt: 'Which inequality correctly compares the integers -6 and -8?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-6 > -8' },
              { id: 'b', text: '-6 < -8' },
              { id: 'c', text: '-6 = -8' },
              { id: 'd', text: '-8 > -6' }
            ],
            correctAnswer: 'a',
            explanation: 'On a number line, -6 is to the right of -8, meaning -6 is greater than -8 (-6 > -8).',
            hint: 'Remember: Being in debt $6 is better (greater) than being in debt $8!',
            funnySuccessLine: 'Alligator mouth chows down on the bigger number: -6!',
            funnyFailLine: 'Remember, with negative numbers, closer to 0 is bigger!',
            sourcePage: 'Page 20 Test Prep #9',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l2-q6',
            moduleId: 'module-1',
            lessonId: 'lesson-1-2',
            lessonTitle: 'Compare & Order Integers on a Number Line',
            prompt: 'Annie and Landon are scuba diving. Annie dives to -11 feet relative to sea level, and Landon dives to -19 feet. Which inequality correctly compares their elevations, and who is closer to the surface?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-11 > -19; Annie is closer to the surface' },
              { id: 'b', text: '-19 > -11; Landon is closer to the surface' },
              { id: 'c', text: '-11 < -19; Annie is closer to the surface' },
              { id: 'd', text: '-11 = -19; They are at identical depths' }
            ],
            correctAnswer: 'a',
            explanation: 'On a vertical number line, -11 is higher up (closer to 0) than -19. Therefore, -11 > -19, and Annie is closer to sea level.',
            hint: 'Closer to 0 means higher elevation when underwater.',
            funnySuccessLine: 'Splashing up to the sun! Annie is higher in the water! 🤿🌊',
            funnyFailLine: 'Careful! -11 is greater than -19 because it is closer to 0!',
            sourcePage: 'Page 18 On Your Own #9',
            difficulty: 'easy',
            points: 100
          }
        ]
      },
      {
        id: 'lesson-1-3',
        title: 'Lesson 1.3: Absolute Value & Magnitude',
        description: 'Understand absolute value as distance from zero, insect supercooling, and financial debts.',
        questions: [
          {
            id: 'm1-l3-q1',
            moduleId: 'module-1',
            lessonId: 'lesson-1-3',
            lessonTitle: 'Absolute Value & Magnitude',
            prompt: 'What does the absolute value of -2, written as |-2|, represent?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'The distance from -2 to 0 on a number line (which is 2 units).' },
              { id: 'b', text: 'A negative number (-2).' },
              { id: 'c', text: 'The opposite of 2, which is -2.' },
              { id: 'd', text: 'Dividing 2 by 0.' }
            ],
            correctAnswer: 'a',
            explanation: 'The absolute value of a number is its distance from zero on a number line. Distance is never negative, so |-2| = 2.',
            hint: 'Absolute value strips away the direction and leaves only pure distance.',
            funnySuccessLine: 'Distance unlocked! 2 steps from zero, loud and proud!',
            funnyFailLine: 'Absolute value is never negative! It measures distance!',
            sourcePage: 'Page 23 Check Understanding #2',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l3-q2',
            moduleId: 'module-1',
            lessonId: 'lesson-1-3',
            lessonTitle: 'Absolute Value & Magnitude',
            prompt: 'Insects survive freezing temperatures using supercooling. The supercooling points are: Pythid beetle (-54 °C), Banded hoverfly (-35 °C), Alpine weta (-9 °C), Woolly bear caterpillar (-70 °C). Which insect has the lowest supercooling point (can survive the coldest)?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Woolly bear caterpillar (-70 °C)' },
              { id: 'b', text: 'Pythid beetle (-54 °C)' },
              { id: 'c', text: 'Common banded hoverfly (-35 °C)' },
              { id: 'd', text: 'New Zealand alpine weta (-9 °C)' }
            ],
            correctAnswer: 'a',
            explanation: '-70 °C is the furthest left on the number line and the lowest temperature.',
            hint: 'Look for the temperature furthest to the left on the number line.',
            funnySuccessLine: 'The woolly bear caterpillar salutes you in arctic sunglasses! 🐛❄️',
            funnyFailLine: 'Check the caterpillar! -70 °C is lower than -54 °C!',
            sourcePage: 'Page 23 Step It Out #2F',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm1-l3-q3',
            moduleId: 'module-1',
            lessonId: 'lesson-1-3',
            lessonTitle: 'Absolute Value & Magnitude',
            prompt: 'Andy and Maurice hike from a cabin (0 miles). Andy walks north to +8 miles. Maurice walks south to -6 miles. Who walked farther from the cabin, and how far did Maurice walk?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Andy walked farther (|8| = 8 > |-6| = 6); Maurice walked 6 miles.' },
              { id: 'b', text: 'Maurice walked farther because -6 is colder.' },
              { id: 'c', text: 'They walked the same distance.' },
              { id: 'd', text: 'Maurice walked -6 miles.' }
            ],
            correctAnswer: 'a',
            explanation: 'Distance is absolute value. Andy: |8| = 8 miles. Maurice: |-6| = 6 miles. 8 > 6, so Andy walked farther.',
            hint: 'Distance is always positive. Compare 8 and 6.',
            funnySuccessLine: 'Trailblazer! You measured distance like a master explorer!',
            funnyFailLine: 'You can\'t walk negative miles! Maurice walked 6 positive miles!',
            sourcePage: 'Page 24 On Your Own #3',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm1-l3-q4',
            moduleId: 'module-1',
            lessonId: 'lesson-1-3',
            lessonTitle: 'Absolute Value & Magnitude',
            prompt: 'Which bank balance represents the GREATEST amount owed?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'A balance of -$20' },
              { id: 'b', text: 'A balance of $27' },
              { id: 'c', text: 'A balance of -$50' },
              { id: 'd', text: 'A balance of -$36' }
            ],
            correctAnswer: 'c',
            explanation: 'Owing money is a negative balance. The greatest amount owed corresponds to the greatest absolute value among negative balances: |-$50| = $50 owed.',
            hint: 'Owing means negative balance, and greatest owed means largest debt magnitude.',
            funnySuccessLine: 'Accountant of the year! Debt analyzed correctly!',
            funnyFailLine: 'Owing $50 is a bigger debt than owing $20!',
            sourcePage: 'Page 26 Test Prep #15',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l3-q5',
            moduleId: 'module-1',
            lessonId: 'lesson-1-3',
            lessonTitle: 'Absolute Value & Magnitude',
            prompt: 'Which statement is mathematically true regarding absolute values?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '|8| = -8' },
              { id: 'b', text: '|10| > |-9|' },
              { id: 'c', text: '|-2| < |1|' },
              { id: 'd', text: '|0| > 0' }
            ],
            correctAnswer: 'b',
            explanation: '|10| = 10 and |-9| = 9. Since 10 > 9, statement B is true.',
            hint: 'Evaluate the absolute values first: |10|=10, |-9|=9.',
            funnySuccessLine: 'Absolute mastery! 10 > 9 like a charm!',
            funnyFailLine: 'Evaluate the bars first! |-9| turns into +9!',
            sourcePage: 'Page 26 Test Prep #16',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-l3-q6',
            moduleId: 'module-1',
            lessonId: 'lesson-1-3',
            lessonTitle: 'Absolute Value & Magnitude',
            prompt: 'The table shows the daily change in visitors at a city library: Monday (+150), Tuesday (-85), Wednesday (+42), Thursday (-209), and Friday (+110). On which day was the MAGNITUDE of the change in visitors the greatest?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Thursday (|-209| = 209 visitors)' },
              { id: 'b', text: 'Monday (|+150| = 150 visitors)' },
              { id: 'c', text: 'Friday (|+110| = 110 visitors)' },
              { id: 'd', text: 'Tuesday (|-85| = 85 visitors)' }
            ],
            correctAnswer: 'a',
            explanation: 'The magnitude of change is measured by absolute value: |-209| = 209, |+150| = 150, |+110| = 110, |-85| = 85, |+42| = 42. Thursday had the greatest magnitude of change.',
            hint: 'Magnitude means absolute value, regardless of positive or negative sign.',
            funnySuccessLine: 'Library crowd surveyed! Thursday saw the biggest swing in readers! 📚✨',
            funnyFailLine: 'Remember magnitude is distance from zero: |-209| is 209, the largest change!',
            sourcePage: 'Page 24 On Your Own #7',
            difficulty: 'medium',
            points: 120
          }
        ]
      },
      {
        id: 'lesson-1-review',
        title: 'Module 1 Challenge & Assessment (Forms A & B)',
        description: 'Comprehensive test prep from the textbook assessment guide.',
        questions: [
          {
            id: 'm1-rev-q1',
            moduleId: 'module-1',
            lessonId: 'lesson-1-review',
            lessonTitle: 'Module 1 Assessment',
            prompt: 'In the last week, the position of Carl\'s favorite song changed by -13 places on the pop music list. Which statement BEST describes the meaning of this integer?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'The song is number 13 on the list.' },
              { id: 'b', text: 'The song is number -13 on the list.' },
              { id: 'c', text: 'The song moved 13 places up on the list.' },
              { id: 'd', text: 'The song moved 13 places down on the list.' }
            ],
            correctAnswer: 'd',
            explanation: 'A change of -13 represents moving 13 places down on the chart.',
            hint: 'Negative change means going down.',
            funnySuccessLine: 'Chart-topper! Even if Carl\'s song dropped, your score rose!',
            funnyFailLine: 'Minus means sliding down the playlist!',
            sourcePage: 'Page 31 Form A Module Test #2',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-rev-q2',
            moduleId: 'module-1',
            lessonId: 'lesson-1-review',
            lessonTitle: 'Module 1 Assessment',
            prompt: 'Which city recorded the coldest winter temperature: Falls Creek (-12 °F), Harper (5 °F), Sun Valley (-4 °F), or Bellport (17 °F)?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Falls Creek (-12 °F)' },
              { id: 'b', text: 'Harper (5 °F)' },
              { id: 'c', text: 'Sun Valley (-4 °F)' },
              { id: 'd', text: 'Bellport (17 °F)' }
            ],
            correctAnswer: 'a',
            explanation: '-12 °F is the lowest value (furthest left on the number line).',
            hint: 'Look for the temperature furthest below zero.',
            funnySuccessLine: 'Grab your parka! Falls Creek is ice cold, but your answer is hot!',
            funnyFailLine: '-12 °F is colder than -4 °F!',
            sourcePage: 'Page 31 Form A Module Test #3',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm1-rev-q3',
            moduleId: 'module-1',
            lessonId: 'lesson-1-review',
            lessonTitle: 'Module 1 Assessment',
            prompt: 'A seagull flies at 27 meters above sea level. A dolphin swims at -27 meters, and a flounder swims at -43 meters. Complete the comparison: The seagull\'s distance from sea level is _____ the dolphin\'s distance, and the _____ is the greatest distance from sea level.',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'the same as; flounder' },
              { id: 'b', text: 'greater than; seagull' },
              { id: 'c', text: 'less than; dolphin' },
              { id: 'd', text: 'the same as; dolphin' }
            ],
            correctAnswer: 'a',
            explanation: '|27| = 27 and |-27| = 27, so the distance is the same (27 meters). |-43| = 43 meters, which is the greatest distance.',
            hint: 'Calculate the absolute values: |27| = 27, |-27| = 27, |-43| = 43.',
            funnySuccessLine: 'Diving deep with the flounder! Flawless reasoning!',
            funnyFailLine: 'Check the absolute values of 27, -27, and -43!',
            sourcePage: 'Page 31 Form A Module Test #6',
            difficulty: 'hard',
            points: 150
          }
        ]
      }
    ]
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Rational Number Concepts',
    themeColor: '#10b981',
    icon: 'fraction',
    description: 'Master fractions & decimals on the number line, rational opposites, LCM, GCF, and real-world comparisons.',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Lesson 2.1: Rational Numbers & Opposites',
        description: 'Locate rational numbers, identify opposites, and compare distances from zero.',
        questions: [
          {
            id: 'm2-l1-q1',
            moduleId: 'module-2',
            lessonId: 'lesson-2-1',
            lessonTitle: 'Rational Numbers & Opposites',
            prompt: 'The lowest elevation at Death Valley National Park is approximately -0.05 mile. What distance is this from sea level, and between what two consecutive integers is -0.05 located?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '0.05 mile; between -1 and 0' },
              { id: 'b', text: '-0.05 mile; between 0 and 1' },
              { id: 'c', text: '0.5 mile; between -2 and -1' },
              { id: 'd', text: '5 miles; between -5 and 0' }
            ],
            correctAnswer: 'a',
            explanation: 'The distance from sea level (0) is |-0.05| = 0.05 mile. On a number line, -0.05 is between -1 and 0.',
            hint: 'Distance is always positive. -0.05 is just to the left of 0.',
            funnySuccessLine: 'Surviving Death Valley without breaking a sweat! Brilliant!',
            funnyFailLine: 'Watch the decimal point and distance sign!',
            sourcePage: 'Page 33 Step It Out #3',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm2-l1-q2',
            moduleId: 'module-2',
            lessonId: 'lesson-2-1',
            lessonTitle: 'Rational Numbers & Opposites',
            prompt: 'A stock market index drops by 1.38 points. What rational number represents the change in the index?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-1.38' },
              { id: 'b', text: '1.38' },
              { id: 'c', text: '0.38' },
              { id: 'd', text: '-138' }
            ],
            correctAnswer: 'a',
            explanation: 'A drop in the index is a decrease, represented by the negative rational number -1.38.',
            hint: 'A drop means a negative sign.',
            funnySuccessLine: 'Wall Street whiz kid! -1.38 points logged!',
            funnyFailLine: 'A drop goes down into the negatives!',
            sourcePage: 'Page 36 Test Prep #12',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm2-l1-q3',
            moduleId: 'module-2',
            lessonId: 'lesson-2-1',
            lessonTitle: 'Rational Numbers & Opposites',
            prompt: 'Match each rational number with its exact opposite: A: 1.5, B: -3.25, C: -1.5, D: 3.25.',
            type: 'matching',
            matchingPairs: [
              { left: '1.5', right: '-1.5' },
              { left: '-3.25', right: '3.25' },
              { left: '-1.5', right: '1.5' },
              { left: '3.25', right: '-3.25' }
            ],
            correctAnswer: 'matched',
            explanation: 'The opposite of any number x is -x. Opposites are equidistant from 0.',
            hint: 'Flip the positive sign to negative, and negative to positive.',
            funnySuccessLine: 'Perfect reflection! Mirror image master!',
            funnyFailLine: 'Double check the signs of the matching pairs!',
            sourcePage: 'Page 36 Test Prep #15',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm2-l1-q4',
            moduleId: 'module-2',
            lessonId: 'lesson-2-1',
            lessonTitle: 'Rational Numbers & Opposites',
            prompt: 'The average weight of a newborn panda is 0.2 pound (or 2/10 pound). Between what two integers is the weight of a newborn panda located?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '0 and 1' },
              { id: 'b', text: '1 and 2' },
              { id: 'c', text: '-1 and 0' },
              { id: 'd', text: '2 and 10' }
            ],
            correctAnswer: 'a',
            explanation: '0.2 is greater than 0 and less than 1, so it lies between the consecutive integers 0 and 1.',
            hint: '0 < 0.2 < 1.',
            funnySuccessLine: 'Cute little panda approved! 🐼 Bamboo for you!',
            funnyFailLine: '0.2 is less than 1 whole pound!',
            sourcePage: 'Page 33 Check Understanding #1',
            difficulty: 'easy',
            points: 100
          }
        ]
      },
      {
        id: 'lesson-2-2',
        title: 'Lesson 2.2: Compare & Order Rational Numbers',
        description: 'Compare fractions, decimals, common denominators, and real-world contexts.',
        questions: [
          {
            id: 'm2-l2-q1',
            moduleId: 'module-2',
            lessonId: 'lesson-2-2',
            lessonTitle: 'Compare & Order Rational Numbers',
            prompt: 'Mrs. Smith corrected 3/4 of last week\'s math assignments, and Mr. Jones corrected 5/8 of last week\'s science assignments. Which teacher corrected the greater portion of the assignments?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Mrs. Smith (3/4 = 6/8 > 5/8)' },
              { id: 'b', text: 'Mr. Jones (5/8 > 3/4)' },
              { id: 'c', text: 'They corrected the same portion' },
              { id: 'd', text: 'Cannot be determined' }
            ],
            correctAnswer: 'a',
            explanation: 'Convert 3/4 to eighths: 3/4 = 6/8. Since 6/8 > 5/8, Mrs. Smith corrected more.',
            hint: 'Find a common denominator of 8: multiply numerator and denominator of 3/4 by 2.',
            funnySuccessLine: 'A+ on assignment grading! 6/8 beats 5/8!',
            funnyFailLine: 'Check common denominators: 3/4 equals 6/8!',
            sourcePage: 'Page 37 Step It Out #1',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm2-l2-q2',
            moduleId: 'module-2',
            lessonId: 'lesson-2-2',
            lessonTitle: 'Compare & Order Rational Numbers',
            prompt: 'Which inequality statement is correct?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '0.6 < -0.3' },
              { id: 'b', text: '0.5 > 0.6' },
              { id: 'c', text: '-0.8 > 0.4' },
              { id: 'd', text: '-0.3 > -0.8' }
            ],
            correctAnswer: 'd',
            explanation: 'On a number line, -0.3 is to the right of -0.8 (closer to zero), so -0.3 > -0.8 is correct.',
            hint: 'Both are negative. The one with smaller absolute value is greater.',
            funnySuccessLine: 'Boom! -0.3 is indeed greater than -0.8!',
            funnyFailLine: 'Watch the negative signs! -0.3 is warmer/greater than -0.8.',
            sourcePage: 'Page 42 Test Prep #8',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm2-l2-q3',
            moduleId: 'module-2',
            lessonId: 'lesson-2-2',
            lessonTitle: 'Compare & Order Rational Numbers',
            prompt: 'On Main Street (library at 0 miles), landmarks are located at: City Park (-0.52 mi), Courthouse (-1.5 mi), Bookstore (1.25 mi), Museum (0.75 mi). Which landmark is farthest from the library?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: 'Courthouse (|-1.5| = 1.5 miles)' },
              { id: 'b', text: 'Bookstore (|1.25| = 1.25 miles)' },
              { id: 'c', text: 'Museum (|0.75| = 0.75 miles)' },
              { id: 'd', text: 'City Park (|-0.52| = 0.52 miles)' }
            ],
            correctAnswer: 'a',
            explanation: 'Distance from library (point 0) is absolute value: Courthouse = 1.5 mi, Bookstore = 1.25 mi, Museum = 0.75 mi, Park = 0.52 mi. 1.5 is the greatest distance.',
            hint: 'Compare the absolute values (distances from 0).',
            funnySuccessLine: 'GPS coordinates locked! Farthest landmark identified!',
            funnyFailLine: 'Remember distance is absolute value: |-1.5| = 1.5 miles!',
            sourcePage: 'Page 40 Step It Out #5',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm2-l2-q4',
            moduleId: 'module-2',
            lessonId: 'lesson-2-2',
            lessonTitle: 'Compare & Order Rational Numbers',
            prompt: 'Order the songbird finch lengths from SHORTEST to LONGEST: Indigo bunting (4.9 in), Crimson finch (5 1/10 in), House finch (5 5/8 in), Purple finch (5.9 in).',
            type: 'ordering',
            options: [
              { id: 'f1', text: 'Indigo bunting (4.9 in)' },
              { id: 'f2', text: 'Crimson finch (5 1/10 in = 5.1 in)' },
              { id: 'f3', text: 'House finch (5 5/8 in = 5.625 in)' },
              { id: 'f4', text: 'Purple finch (5.9 in)' }
            ],
            correctAnswer: ['f1', 'f2', 'f3', 'f4'],
            explanation: 'Convert to decimals: 4.9 < 5.1 < 5.625 < 5.9. Therefore: Indigo bunting, Crimson finch, House finch, Purple finch.',
            hint: 'Convert fractions to decimals: 5 1/10 = 5.1 and 5 5/8 = 5.625.',
            funnySuccessLine: 'Chirp chirp! The songbirds sing your mathematical praise! 🐦🎵',
            funnyFailLine: 'Careful! 5 5/8 is 5.625, which is smaller than 5.9!',
            sourcePage: 'Page 58 Module Review #14',
            difficulty: 'hard',
            points: 150
          },
          {
            id: 'm2-l2-q5',
            moduleId: 'module-2',
            lessonId: 'lesson-2-2',
            lessonTitle: 'Compare & Order Rational Numbers',
            prompt: 'At an archaeological dig site, a mouse fossil was uncovered at a depth of 5 3/4 feet below ground level. Archaeologists also uncovered: a bronze spoon (-6 1/4 ft), an iron key (-4 1/2 ft), a clay cup (-5 7/8 ft), and a stone bowl (-5 1/2 ft). Select ALL artifacts found at a depth DEEPER (greater depth below ground) than the mouse fossil.',
            type: 'multi_select',
            options: [
              { id: 'a', text: 'Bronze spoon (6 1/4 ft deep)' },
              { id: 'b', text: 'Iron key (4 1/2 ft deep)' },
              { id: 'c', text: 'Clay cup (5 7/8 ft deep)' },
              { id: 'd', text: 'Stone bowl (5 1/2 ft deep)' }
            ],
            correctAnswer: ['a', 'c'],
            explanation: 'Comparing depths: Mouse fossil = 5 3/4 ft = 5 6/8 ft. The bronze spoon (6 1/4 ft = 6 2/8 ft) and clay cup (5 7/8 ft) are deeper than 5 6/8 ft. The key (4 4/8 ft) and bowl (5 4/8 ft) are shallower.',
            hint: 'Write all depths with denominator 8: Mouse is 5 6/8. Which depths are greater than 5 6/8?',
            funnySuccessLine: 'Indiana Jones would be proud! 🏺 Fossils and artifacts dated with precision!',
            funnyFailLine: 'Compare with common denominator 8: 5 3/4 = 5 6/8. 5 7/8 and 6 1/4 are deeper!',
            sourcePage: 'Page 50 Step It Out #3',
            difficulty: 'hard',
            points: 150
          },
          {
            id: 'm2-l2-q6',
            moduleId: 'module-2',
            lessonId: 'lesson-2-2',
            lessonTitle: 'Compare & Order Rational Numbers',
            prompt: 'The record low temperatures for two towns are: Barres at -1.7 °F and Edgeville at -1.5 °F. Which inequality correctly compares these temperatures, and which town experienced the colder temperature?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '-1.7 °F < -1.5 °F; Barres was colder' },
              { id: 'b', text: '-1.7 °F > -1.5 °F; Barres was warmer' },
              { id: 'c', text: '-1.5 °F < -1.7 °F; Edgeville was colder' },
              { id: 'd', text: '-1.7 °F = -1.5 °F; Both were equally cold' }
            ],
            correctAnswer: 'a',
            explanation: 'On a number line, -1.7 is to the left of -1.5, so -1.7 < -1.5. Lower temperature means colder, so Barres was colder.',
            hint: 'On a thermometer, numbers further below 0 are colder and smaller.',
            funnySuccessLine: 'Freezing cold math genius! Barres at -1.7 °F is colder than -1.5 °F! ❄️🌡️',
            funnyFailLine: 'Remember, -1.7 is further below zero than -1.5, so -1.7 < -1.5!',
            sourcePage: 'Page 39 Step It Out #3',
            difficulty: 'easy',
            points: 100
          }
        ]
      },
      {
        id: 'lesson-2-3',
        title: 'Lesson 2.3: Find & Apply LCM and GCF',
        description: 'Solve real-world snack packaging, schedule cycles, and the distributive property.',
        questions: [
          {
            id: 'm2-l3-q1',
            moduleId: 'module-2',
            lessonId: 'lesson-2-3',
            lessonTitle: 'Find & Apply LCM and GCF',
            prompt: 'Taylor and Jake have 24 granola bars and 16 water bottles for chess club. What is the GREATEST number of identical snack packs they can make with none left over, and what is the distributive expression?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '8 snack packs; 8(3 + 2)' },
              { id: 'b', text: '4 snack packs; 4(6 + 4)' },
              { id: 'c', text: '16 snack packs; 16(1 + 1)' },
              { id: 'd', text: '6 snack packs; 6(4 + 3)' }
            ],
            correctAnswer: 'a',
            explanation: 'GCF(24, 16) = 8. 24 = 8 * 3 and 16 = 8 * 2. By the Distributive Property: 24 + 16 = 8(3 + 2).',
            hint: 'Find the Greatest Common Factor of 24 and 16.',
            funnySuccessLine: 'Checkmate! 8 delicious snack packs packed to perfection!',
            funnyFailLine: 'Check the greatest common factor: 8 divides both 24 and 16!',
            sourcePage: 'Page 44 Step It Out #2',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm2-l3-q2',
            moduleId: 'module-2',
            lessonId: 'lesson-2-3',
            lessonTitle: 'Find & Apply LCM and GCF',
            prompt: 'A radio station gives concert tickets to every 60th caller and a concert T-shirt to every 45th caller. What will be the number of the FIRST caller to get BOTH items?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '180th caller (LCM of 60 and 45)' },
              { id: 'b', text: '15th caller (GCF of 60 and 45)' },
              { id: 'c', text: '120th caller' },
              { id: 'd', text: '300th caller' }
            ],
            correctAnswer: 'a',
            explanation: 'The first caller to receive both is the Least Common Multiple: Multiples of 60: 60, 120, 180... Multiples of 45: 45, 90, 135, 180. LCM = 180.',
            hint: 'Find the Least Common Multiple (LCM) of 60 and 45.',
            funnySuccessLine: 'Caller 180, you just won VIP tickets and math glory! 🎟️📻',
            funnyFailLine: 'Caller needs both! Find LCM(60, 45).',
            sourcePage: 'Page 49 Lesson 2.3 #2',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm2-l3-q3',
            moduleId: 'module-2',
            lessonId: 'lesson-2-3',
            lessonTitle: 'Find & Apply LCM and GCF',
            prompt: 'Korey runs every 3rd day and swims every 4th day. If he runs and swims today, how many days will it be before Korey runs and swims again on the same day?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '12 days' },
              { id: 'b', text: '7 days' },
              { id: 'c', text: '24 days' },
              { id: 'd', text: '1 day' }
            ],
            correctAnswer: 'a',
            explanation: 'LCM of 3 and 4 is 12. Korey will run and swim together in 12 days.',
            hint: 'What is the smallest number that 3 and 4 both divide into?',
            funnySuccessLine: 'Lap champion! 12 days to the ultimate triathlon!',
            funnyFailLine: 'Find the LCM of 3 and 4, not the sum!',
            sourcePage: 'Page 36 Form A Module Test #9',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm2-l3-q4',
            moduleId: 'module-2',
            lessonId: 'lesson-2-3',
            lessonTitle: 'Find & Apply LCM and GCF',
            prompt: 'Ms. Franco has 64 pencils and 48 erasers. She wants to put an equal number of pencils and erasers into boxes. What is the GREATEST number of pencils or erasers she can put in each box?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '16' },
              { id: 'b', text: '24' },
              { id: 'c', text: '8' },
              { id: 'd', text: '12' }
            ],
            correctAnswer: 'a',
            explanation: 'GCF(64, 48): Factors of 64 include 16 (16 * 4 = 64). Factors of 48 include 16 (16 * 3 = 48). GCF is 16.',
            hint: 'Find GCF(64, 48). Does 16 divide both evenly?',
            funnySuccessLine: 'Sharpened to perfection! Ms. Franco is overjoyed!',
            funnyFailLine: '24 doesn\'t divide 64! Look for 16!',
            sourcePage: 'Page 35 Form A Module Test #6',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm2-l3-q5',
            moduleId: 'module-2',
            lessonId: 'lesson-2-3',
            lessonTitle: 'Find & Apply LCM and GCF',
            prompt: 'A party caterer packs 48 plates and 54 bowls into shipping boxes. Each box will have the same number of items, and plates and bowls are packed separately with no items leftover. What is the GREATEST number of items that can be placed in each box, and how can the total items be expressed using the Distributive Property?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '6 items per box; 6(8 + 9)' },
              { id: 'b', text: '8 items per box; 8(6 + 7)' },
              { id: 'c', text: '9 items per box; 9(5 + 6)' },
              { id: 'd', text: '12 items per box; 12(4 + 5)' }
            ],
            correctAnswer: 'a',
            explanation: 'Find GCF(48, 54): Factors of 48 = {1, 2, 3, 4, 6, 8, 12, 16, 24, 48}. Factors of 54 = {1, 2, 3, 6, 9, 18, 27, 54}. The GCF is 6. 48 = 6 * 8 and 54 = 6 * 9, so 48 + 54 = 6(8 + 9).',
            hint: 'Find the greatest common factor of 48 and 54, then factor it out: GCF * (quotient1 + quotient2).',
            funnySuccessLine: 'Banquet served! 6 items per box, zero plates broken! 🍽️📦',
            funnyFailLine: 'Check factors of 48 and 54: 6 divides both 48 (6*8) and 54 (6*9)!',
            sourcePage: 'Page 48 Step It Out #4',
            difficulty: 'medium',
            points: 130
          }
        ]
      }
    ]
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Fraction Division',
    themeColor: '#f59e0b',
    icon: 'divide',
    description: 'Master fraction division using visual models, reciprocals, dividing fractions by fractions, and dividing mixed numbers.',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Lesson 3.1: Understand Fraction Division with Models',
        description: 'Explore visual fraction division, unit fractions, and number line jumps.',
        questions: [
          {
            id: 'm3-l1-q1',
            moduleId: 'module-3',
            lessonId: 'lesson-3-1',
            lessonTitle: 'Understand Fraction Division with Models',
            prompt: 'A town road is 9/10 mile long. A town plants a tree every 2/10 of a mile from the start. How many full intervals of trees can the town plant?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '4 trees (9/10 ÷ 2/10 = 4 1/2, so 4 full intervals)' },
              { id: 'b', text: '5 trees' },
              { id: 'c', text: '2 trees' },
              { id: 'd', text: '9 trees' }
            ],
            correctAnswer: 'a',
            explanation: '9/10 ÷ 2/10 = 9 ÷ 2 = 4 1/2. You cannot plant half a tree interval, so there are 4 trees.',
            hint: 'When denominators are the same, divide the numerators: 9 ÷ 2 = 4 with remainder 1.',
            funnySuccessLine: 'Arbor Day victory! 4 lovely green trees planted! 🌳',
            funnyFailLine: 'You can\'t plant half a tree! 4 full intervals fit.',
            sourcePage: 'Page 64 Step It Out #4',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm3-l1-q2',
            moduleId: 'module-3',
            lessonId: 'lesson-3-1',
            lessonTitle: 'Understand Fraction Division with Models',
            prompt: 'Hana is organizing a 3/4-mile fun run. There will be a water station every 1/4 mile after the start. How many water stations will there be?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '3 water stations (3/4 ÷ 1/4 = 3)' },
              { id: 'b', text: '4 water stations' },
              { id: 'c', text: '1 water station' },
              { id: 'd', text: '12 water stations' }
            ],
            correctAnswer: 'a',
            explanation: 'How many 1/4s in 3/4? 3/4 ÷ 1/4 = 3/1 = 3 water stations.',
            hint: 'Count the 1/4 segments: 1/4, 2/4, 3/4.',
            funnySuccessLine: 'Hydration celebration! 3 water cups ready! 💧🏃',
            funnyFailLine: 'Count by fourths: 1/4, 2/4, 3/4 = 3 stations!',
            sourcePage: 'Page 64 Check Understanding #1',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm3-l1-q3',
            moduleId: 'module-3',
            lessonId: 'lesson-3-1',
            lessonTitle: 'Understand Fraction Division with Models',
            prompt: 'Jolene is cutting a strip of yarn that is 11/12 inch long into pieces that are 2/12 inch long for a collage. How many COMPLETE pieces can she make?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '5 complete pieces (with 1/12 inch leftover)' },
              { id: 'b', text: '6 complete pieces' },
              { id: 'c', text: '4 complete pieces' },
              { id: 'd', text: '11 complete pieces' }
            ],
            correctAnswer: 'a',
            explanation: '11/12 ÷ 2/12 = 11 ÷ 2 = 5 1/2. So Jolene can make 5 complete pieces.',
            hint: 'Divide 11 by 2: 11 ÷ 2 = 5 with 1 leftover.',
            funnySuccessLine: 'Snip snip! Collage masterpiece in progress! ✂️🧶',
            funnyFailLine: '11 ÷ 2 = 5 remainder 1! Only 5 complete pieces!',
            sourcePage: 'Page 68 Test Prep #6',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm3-l1-q4',
            moduleId: 'module-3',
            lessonId: 'lesson-3-1',
            lessonTitle: 'Understand Fraction Division with Models',
            prompt: 'Sinh has 14/16 pound of nuts. He separates them into 2/16-pound servings. Which expression models this situation?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '14/16 ÷ 2/16' },
              { id: 'b', text: '2/16 ÷ 14/16' },
              { id: 'c', text: '14/16 * 2/16' },
              { id: 'd', text: '14/16 - 2/16' }
            ],
            correctAnswer: 'a',
            explanation: 'Total nuts (14/16) divided by serving size (2/16) gives 14/16 ÷ 2/16.',
            hint: 'Total amount ÷ size of each group.',
            funnySuccessLine: 'Nutty genius! That expression models the exact snack batch!',
            funnyFailLine: 'Total amount must be the dividend (comes first)!',
            sourcePage: 'Page 68 Test Prep #7',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm3-l1-q5',
            moduleId: 'module-3',
            lessonId: 'lesson-3-1',
            lessonTitle: 'Understand Fraction Division with Models',
            prompt: 'A vegetable garden covers an 8/10-acre plot of land. The plot is divided into smaller garden sections covering 2/5 acre each. How many sections are in the vegetable garden?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '2 sections (8/10 ÷ 2/5 = 8/10 * 5/2 = 40/20 = 2)' },
              { id: 'b', text: '4 sections' },
              { id: 'c', text: '1 section' },
              { id: 'd', text: '5 sections' }
            ],
            correctAnswer: 'a',
            explanation: 'Divide the total garden area by the section area: 8/10 ÷ 2/5 = 8/10 * 5/2 = 40/20 = 2 sections.',
            hint: 'Invert the divisor 2/5 to 5/2 and multiply: (8 * 5) / (10 * 2) = 40/20.',
            funnySuccessLine: 'Green thumb alert! 2 bountiful vegetable sections ready for carrots! 🥕🍅',
            funnyFailLine: 'Multiply by reciprocal: (8/10) * (5/2) = 40/20 = 2 sections!',
            sourcePage: 'Page 67 On Your Own #3',
            difficulty: 'easy',
            points: 100
          }
        ]
      },
      {
        id: 'lesson-3-2',
        title: 'Lesson 3.2: Divide Fractions & Reciprocals',
        description: 'Invert and multiply, find reciprocals, and solve unlike denominator fractions.',
        questions: [
          {
            id: 'm3-l2-q1',
            moduleId: 'module-3',
            lessonId: 'lesson-3-2',
            lessonTitle: 'Divide Fractions & Reciprocals',
            prompt: 'Tina feeds her dog 4/7 pound of dog food per day. If she buys a bag containing 9 pounds of dog food, how many days will the bag last?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '15 3/4 days (9 ÷ 4/7 = 9 * 7/4 = 63/4)' },
              { id: 'b', text: '36/7 days' },
              { id: 'c', text: '12 days' },
              { id: 'd', text: '18 1/2 days' }
            ],
            correctAnswer: 'a',
            explanation: '9 ÷ 4/7 = 9/1 * 7/4 = 63/4 = 15 3/4 days.',
            hint: 'Multiply 9 by the reciprocal of 4/7, which is 7/4.',
            funnySuccessLine: 'Woof woof! Happy pup with 15 3/4 days of yummy food! 🐶🥣',
            funnyFailLine: 'Remember to multiply by the reciprocal 7/4!',
            sourcePage: 'Page 72 Step It Out #3',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm3-l2-q2',
            moduleId: 'module-3',
            lessonId: 'lesson-3-2',
            lessonTitle: 'Divide Fractions & Reciprocals',
            prompt: 'Match each fraction or number with its reciprocal: A: 7/8, B: 1/10, C: 12, D: 14/16.',
            type: 'matching',
            matchingPairs: [
              { left: '7/8', right: '8/7' },
              { left: '1/10', right: '10' },
              { left: '12', right: '1/12' },
              { left: '14/16', right: '16/14' }
            ],
            correctAnswer: 'matched',
            explanation: 'The reciprocal of a/b is b/a. The reciprocal of a whole number n is 1/n.',
            hint: 'Flip the numerator and denominator upside down.',
            funnySuccessLine: 'Gymnastic flip! All reciprocals landed on their feet!',
            funnyFailLine: 'Flip top and bottom! 1/10 flipped becomes 10/1 = 10!',
            sourcePage: 'Page 75 Lesson 3.2 #5-8',
            difficulty: 'medium',
            points: 120
          },
          {
            id: 'm3-l2-q3',
            moduleId: 'module-3',
            lessonId: 'lesson-3-2',
            lessonTitle: 'Divide Fractions & Reciprocals',
            prompt: 'A small bookshelf is 8/12 yard long. How many books can fit on the shelf if the width of each book is 1/24 yard?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '16 books (8/12 ÷ 1/24 = 8/12 * 24/1 = 16)' },
              { id: 'b', text: '12 books' },
              { id: 'c', text: '8 books' },
              { id: 'd', text: '24 books' }
            ],
            correctAnswer: 'a',
            explanation: '8/12 ÷ 1/24 = 8/12 * 24/1 = (8 * 2) = 16 books.',
            hint: 'Simplify 24/12 = 2, then multiply 8 * 2.',
            funnySuccessLine: 'Library stacked! 16 books placed neatly on the shelf! 📚',
            funnyFailLine: 'Invert 1/24 to 24/1 and multiply: (8/12) * 24 = 16!',
            sourcePage: 'Page 75 Lesson 3.2 #1',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm3-l2-q4',
            moduleId: 'module-3',
            lessonId: 'lesson-3-2',
            lessonTitle: 'Divide Fractions & Reciprocals',
            prompt: 'What is the value of the expression: 2/10 ÷ 5/4?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '8/50 (or 4/25)' },
              { id: 'b', text: '1/50' },
              { id: 'c', text: '4/10' },
              { id: 'd', text: '1/2' }
            ],
            correctAnswer: 'a',
            explanation: '2/10 ÷ 5/4 = 2/10 * 4/5 = 8/50.',
            hint: 'Multiply the first fraction by the reciprocal of the second: (2 * 4) / (10 * 5).',
            funnySuccessLine: 'Fraction division superstar! 8/50 in the bag!',
            funnyFailLine: 'Multiply numerators (2*4=8) and denominators (10*5=50)!',
            sourcePage: 'Page 76 Test Prep #19',
            difficulty: 'easy',
            points: 100
          },
          {
            id: 'm3-l2-q5',
            moduleId: 'module-3',
            lessonId: 'lesson-3-2',
            lessonTitle: 'Divide Fractions & Reciprocals',
            prompt: 'Select ALL expressions that have the same value as 3/5 ÷ 6/8.',
            type: 'multi_select',
            options: [
              { id: 'a', text: '3/5 * 8/6' },
              { id: 'b', text: '24/40 ÷ 30/40' },
              { id: 'c', text: '3/5 * 6/8' },
              { id: 'd', text: '5/3 * 8/6' },
              { id: 'e', text: '24/40 * 40/30' }
            ],
            correctAnswer: ['a', 'b', 'e'],
            explanation: '3/5 ÷ 6/8 is equivalent to 3/5 * 8/6. With common denominator 40: 24/40 ÷ 30/40, which also equals 24/40 * 40/30.',
            hint: 'Inverting the divisor or rewriting with a common denominator keeps the value equivalent.',
            funnySuccessLine: 'Trifecta! You uncovered all equivalent expressions!',
            funnyFailLine: 'Careful! Don\'t invert the dividend (the first fraction)!',
            sourcePage: 'Page 76 Test Prep #21',
            difficulty: 'hard',
            points: 150
          },
          {
            id: 'm3-l2-q6',
            moduleId: 'module-3',
            lessonId: 'lesson-3-2',
            lessonTitle: 'Divide Fractions & Reciprocals',
            prompt: 'STEM Connection: An aluminum atom has a diameter of about 7/25 nanometer. One Ångström unit is equal to 1/10 nanometer. How many Ångströms is the diameter of an aluminum atom?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '2 4/5 Ångströms (or 2.8 Ångströms)' },
              { id: 'b', text: '7/250 Ångström' },
              { id: 'c', text: '1 1/2 Ångströms' },
              { id: 'd', text: '3 1/4 Ångströms' }
            ],
            correctAnswer: 'a',
            explanation: 'Divide the atom diameter by the size of one Ångström: 7/25 ÷ 1/10 = 7/25 * 10/1 = 70/25 = 14/5 = 2 4/5 (or 2.8) Ångströms.',
            hint: 'Divide 7/25 by 1/10 by multiplying 7/25 by 10/1.',
            funnySuccessLine: 'Subatomic superhero! You zoomed straight into the nucleus of the atom! ⚛️🔬',
            funnyFailLine: 'Invert 1/10 to 10/1: (7/25) * 10 = 70/25 = 14/5 = 2 4/5 Ångströms!',
            sourcePage: 'Page 76 STEM Connection #18',
            difficulty: 'hard',
            points: 150
          }
        ]
      },
      {
        id: 'lesson-3-3',
        title: 'Lesson 3.3: Divide Mixed Numbers & Story Problems',
        description: 'Convert mixed numbers to improper fractions, real-world alligator and bicycle problems.',
        questions: [
          {
            id: 'm3-l3-q1',
            moduleId: 'module-3',
            lessonId: 'lesson-3-3',
            lessonTitle: 'Divide Mixed Numbers',
            prompt: 'Harley rides her bicycle the same distance every day for 4 days. The total distance she rides is 8 1/4 miles. How many miles does she ride each day?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '2 1/16 miles' },
              { id: 'b', text: '2 miles' },
              { id: 'c', text: '33/4 miles' },
              { id: 'd', text: '2 1/4 miles' }
            ],
            correctAnswer: 'a',
            explanation: 'Convert 8 1/4 to 33/4. Then 33/4 ÷ 4 = 33/4 * 1/4 = 33/16 = 2 1/16 miles per day.',
            hint: 'Change 8 1/4 to an improper fraction: (8*4 + 1)/4 = 33/4. Then divide by 4 (multiply by 1/4).',
            funnySuccessLine: 'Pedal power! 2 1/16 miles a day keeps the math cobwebs away! 🚲💨',
            funnyFailLine: 'Multiply denominator 4 by 4 to get 16 in the denominator!',
            sourcePage: 'Page 84 Test Prep #12',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm3-l3-q2',
            moduleId: 'module-3',
            lessonId: 'lesson-3-3',
            lessonTitle: 'Divide Mixed Numbers',
            prompt: 'Tara made 2 3/4 cups of white rice for a dinner party. She has 3 friends coming and will give each person, including herself (4 people total), the same amount of rice. How many cups of rice will each person get?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '11/16 cup' },
              { id: 'b', text: '7/20 cup' },
              { id: 'c', text: '1 7/20 cups' },
              { id: 'd', text: '1 11/16 cups' }
            ],
            correctAnswer: 'a',
            explanation: 'Tara + 3 friends = 4 people. 2 3/4 = 11/4 cups. 11/4 ÷ 4 = 11/4 * 1/4 = 11/16 cup each.',
            hint: 'Don\'t forget to count Tara herself: 3 friends + 1 Tara = 4 people total!',
            funnySuccessLine: 'Delicious dinner served! Exactly 11/16 cup per bowl! 🍚✨',
            funnyFailLine: 'Remember to divide by 4 (Tara + 3 friends)!',
            sourcePage: 'Page 90 Test Prep #13',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm3-l3-q3',
            moduleId: 'module-3',
            lessonId: 'lesson-3-3',
            lessonTitle: 'Divide Mixed Numbers',
            prompt: 'An alligator is 11 3/4 feet long. Its tail is 5 7/8 feet long. What fraction of the alligator\'s total length is its tail?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '1/2' },
              { id: 'b', text: '1/3' },
              { id: 'c', text: '2/3' },
              { id: 'd', text: '3/4' }
            ],
            correctAnswer: 'a',
            explanation: '5 7/8 = 47/8. 11 3/4 = 47/4. Divide tail by total: (47/8) ÷ (47/4) = (47/8) * (4/47) = 4/8 = 1/2.',
            hint: 'Convert both mixed numbers to eighths or improper fractions: 47/8 ÷ 47/4.',
            funnySuccessLine: 'See you later, alligator! Exactly 1/2 of that giant beast is tail! 🐊📏',
            funnyFailLine: 'Look closely: 5 7/8 doubled is 11 6/8 = 11 3/4!',
            sourcePage: 'Page 90 Test Prep #15',
            difficulty: 'hard',
            points: 150
          },
          {
            id: 'm3-l3-q4',
            moduleId: 'module-3',
            lessonId: 'lesson-3-3',
            lessonTitle: 'Divide Mixed Numbers',
            prompt: 'Foster needs to divide a plot of land covering 5 3/8 acres into plots covering 3/4 acre each. How many WHOLE plots can he make?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '7 whole plots (43/8 ÷ 3/4 = 43/8 * 4/3 = 43/6 = 7 1/6)' },
              { id: 'b', text: '6 whole plots' },
              { id: 'c', text: '8 whole plots' },
              { id: 'd', text: '5 whole plots' }
            ],
            correctAnswer: 'a',
            explanation: '5 3/8 = 43/8. 43/8 ÷ 3/4 = 43/8 * 4/3 = 43/6 = 7 1/6. The number of whole plots is 7.',
            hint: 'Find the integer part of 43 ÷ 6.',
            funnySuccessLine: 'Land baron Foster approves! 7 whole plots surveyed! 🚜🌾',
            funnyFailLine: '43 ÷ 6 is 7 with remainder 1! So 7 whole plots.',
            sourcePage: 'Page 90 Test Prep #14',
            difficulty: 'hard',
            points: 150
          },
          {
            id: 'm3-l3-q5',
            moduleId: 'module-3',
            lessonId: 'lesson-3-3',
            lessonTitle: 'Divide Mixed Numbers',
            prompt: 'Which two expressions are equivalent to 4 1/2 ÷ 2 1/4?',
            type: 'multi_select',
            options: [
              { id: 'a', text: '9/2 ÷ 9/4' },
              { id: 'b', text: '9/2 * 4/9' },
              { id: 'c', text: '4 1/2 * 2 1/4' },
              { id: 'd', text: '2/9 * 4/9' }
            ],
            correctAnswer: ['a', 'b'],
            explanation: '4 1/2 = 9/2 and 2 1/4 = 9/4. So 4 1/2 ÷ 2 1/4 = 9/2 ÷ 9/4 = 9/2 * 4/9 = 2.',
            hint: 'Convert to improper fractions first: 4 1/2 = 9/2 and 2 1/4 = 9/4.',
            funnySuccessLine: 'Double bullseye! Both equivalent forms locked in!',
            funnyFailLine: 'Convert both to improper fractions: 9/2 and 9/4!',
            sourcePage: 'Page 90 Test Prep #11',
            difficulty: 'medium',
            points: 130
          },
          {
            id: 'm3-l3-q6',
            moduleId: 'module-3',
            lessonId: 'lesson-3-3',
            lessonTitle: 'Divide Mixed Numbers',
            prompt: 'Marcus made 3 3/4 quarts of chicken noodle soup. He pours the soup into takeaway meal containers that each hold 3/4 quart. How many containers does Marcus fill?',
            type: 'multiple_choice',
            options: [
              { id: 'a', text: '5 containers (3 3/4 ÷ 3/4 = 15/4 ÷ 3/4 = 5)' },
              { id: 'b', text: '4 containers' },
              { id: 'c', text: '6 containers' },
              { id: 'd', text: '3 containers' }
            ],
            correctAnswer: 'a',
            explanation: '3 3/4 = 15/4 quarts. Since the denominators are both 4: 15/4 ÷ 3/4 = 15 ÷ 3 = 5 containers filled.',
            hint: 'Convert 3 3/4 to an improper fraction: (3 * 4 + 3) / 4 = 15/4. Then divide 15 by 3.',
            funnySuccessLine: 'Steaming hot victory! 5 containers of soup ladled to perfection! 🍲😋',
            funnyFailLine: 'Change 3 3/4 to 15/4! 15 fourths divided by 3 fourths = 5!',
            sourcePage: 'Page 81 Check Understanding #2',
            difficulty: 'easy',
            points: 100
          }
        ]
      }
    ]
  }
];

export const INITIAL_LEADERBOARD_DATA = [
  { id: 'user-tiana', rank: 1, name: 'Tiana (Track Star)', avatar: '🏃‍♀️', companion: 'nibbles', moduleScore: 1250, totalXp: 2600, stars: 24, level: 8 },
  { id: 'user-caleb', rank: 2, name: 'Caleb (Disc Golfer)', avatar: '🥏', companion: 'beepboop', moduleScore: 1180, totalXp: 2450, stars: 22, level: 8 },
  { id: 'user-tara', rank: 3, name: 'Tara (Chef)', avatar: '👩‍🍳', companion: 'fluffington', moduleScore: 1100, totalXp: 2200, stars: 20, level: 7 },
  { id: 'user-foster', rank: 4, name: 'Foster (Surveyor)', avatar: '🚜', companion: 'barnaby', moduleScore: 980, totalXp: 1950, stars: 18, level: 7 },
  { id: 'user-patrik', rank: 5, name: 'Patrick (Baker)', avatar: '🥐', companion: 'nibbles', moduleScore: 920, totalXp: 1750, stars: 16, level: 6 },
  { id: 'user-jolene', rank: 6, name: 'Jolene (Artist)', avatar: '🎨', companion: 'fluffington', moduleScore: 860, totalXp: 1600, stars: 15, level: 6 },
  { id: 'user-korey', rank: 7, name: 'Korey (Swimmer)', avatar: '🏊‍♂️', companion: 'beepboop', moduleScore: 780, totalXp: 1420, stars: 13, level: 6 },
  { id: 'user-andy', rank: 8, name: 'Andy (Hiker)', avatar: '🧭', companion: 'barnaby', moduleScore: 710, totalXp: 1280, stars: 12, level: 5 },
  { id: 'user-tammy', rank: 9, name: 'Tammy (Putt Pro)', avatar: '⛳', companion: 'fluffington', moduleScore: 650, totalXp: 1100, stars: 10, level: 5 },
  { id: 'user-lamar', rank: 10, name: 'Lamar (Math Scout)', avatar: '🧢', companion: 'nibbles', moduleScore: 590, totalXp: 950, stars: 9, level: 5 }
];
