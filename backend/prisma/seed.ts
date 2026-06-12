import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PHASES = [
  { order: 1, title: 'Programming Fundamentals', slug: 'programming-fundamentals', description: 'Variables, loops, control structures, and basic recursion.' },
  { order: 2, title: 'Arrays', slug: 'arrays', description: 'Master 1D and 2D arrays, searching, sorting, and sliding window techniques.' },
  { order: 3, title: 'Strings', slug: 'strings', description: 'String manipulation, hashing, and advanced pattern matching algorithms.' },
  { order: 4, title: 'Linked Lists', slug: 'linked-lists', description: 'Singly, doubly, and circular linked lists, and list traversal strategies.' },
  { order: 5, title: 'Stack & Queue', slug: 'stack-queue', description: 'LIFO and FIFO structures, monotonic stacks, expressions, and deques.' },
  { order: 6, title: 'Hashing', slug: 'hashing', description: 'Hash maps, hash sets, collision resolution, and frequency counting.' },
  { order: 7, title: 'Trees', slug: 'trees', description: 'Binary trees, binary search trees, heap priority queues, and traversals.' },
  { order: 8, title: 'Graphs', slug: 'graphs', description: 'Graph representations, traversals, shortest paths, MST, and DSU.' },
  { order: 9, title: 'Recursion & Backtracking', slug: 'recursion-backtracking', description: 'State-space search, permutations, subsets, and solving grid puzzles.' },
  { order: 10, title: 'Dynamic Programming', slug: 'dynamic-programming', description: 'Memoization, tabulation, grid DP, knapsack, and sequence matching.' },
  { order: 11, title: 'Greedy Algorithms', slug: 'greedy-algorithms', description: 'Local optimization, interval scheduling, and optimal coding.' },
  { order: 12, title: 'Advanced Data Structures', slug: 'advanced-data-structures', description: 'Segment trees, Fenwick trees, Tries, and sparse tables.' },
  { order: 13, title: 'Advanced Algorithms', slug: 'advanced-algorithms', description: 'Network flow, suffix arrays, computational geometry, and KMP-based automatons.' }
];

const TOPICS_PER_PHASE: { [key: string]: string[] } = {
  'programming-fundamentals': [
    'Variables & Constants', 'Data Types & Sizes', 'Operators & Precedence', 'Input & Output Streams',
    'If-Else Conditionals', 'Switch-Case Statements', 'For Loops', 'While & Do-While Loops',
    'Nested Loops', 'Function Declarations', 'Function Scope & Parameters', 'Return Statements',
    'Call Stack & Basic Recursion', 'Recursion Base Cases', 'Recursion Tree Analysis',
    'Bitwise AND, OR, XOR', 'Bitwise Shifts & Masks', 'Count Set Bits', 'Power of Two Check',
    'Single Number Finder', 'Bitmasking Subsets', 'Endianness Basics', 'Memory Layout of Variables',
    'Best Practices in Basic Coding'
  ],
  'arrays': [
    'Array Declarations & Memory', '1D Array Traversals', '2D Array Operations', 'Element Insertion Methods',
    'Element Deletion Methods', 'Linear Search Algorithm', 'Binary Search Algorithm', 'Bubble & Selection Sort',
    'Insertion & Merge Sort', 'Quick Sort Partitioning', 'Prefix Sum Array Technique', 'Suffix Sum Array Technique',
    'Sliding Window (Fixed Size)', 'Sliding Window (Variable Size)', 'Two Pointer Converging Technique',
    'Two Pointer Running Technique', 'Kadane\'s Maximum Subarray', 'Dutch National Flag Partitioning',
    'Merge Overlapping Intervals', 'Missing Number in Array', 'Rotate Array by K Positions',
    'Product Except Self', 'Trapping Rain Water Problem', 'Matrix Rotation & Transposition'
  ],
  'strings': [
    'String Representations', 'String Immutability', 'String Searching Basics', 'Polynomial Rolling Hash',
    'Double Hashing for Strings', 'Rabin Karp Pattern Search', 'KMP Prefix Function', 'KMP Pattern Matcher',
    'Z-Box Algorithm Array', 'Manacher\'s Palindrome Center', 'Trie-based String Insertion',
    'Trie-based String Lookup', 'Anagram Check Algorithms', 'Palindromic Substrings Count',
    'Longest Common Prefix', 'String Compression Methods', 'Integer to Roman Converter',
    'Roman to Integer Converter', 'Valid Parentheses String', 'Minimum Window Substring',
    'Regular Expression Parsing', 'Boyer Moore Search Pattern', 'String Alignment Edit Distance',
    'Wildcard Matching Strings'
  ],
  'linked-lists': [
    'Singly Linked List Node', 'Singly List Insertions', 'Singly List Deletions', 'Doubly Linked List Node',
    'Doubly List Node Insertion', 'Doubly List Node Deletion', 'Circular Singly Linked List',
    'Circular Doubly Linked List', 'Fast & Slow Pointer Concept', 'Cycle Detection (Floyd\'s)',
    'Find Loop Start Node', 'Middle of Linked List', 'Reverse Singly Linked List',
    'Reverse Doubly Linked List', 'Merge Two Sorted Lists', 'Merge K Sorted Lists',
    'Remove Nth Node From End', 'Add Two Numbers as Lists', 'Copy List with Random Pointer',
    'Flatten Multi-level List', 'Rotate Linked List', 'Odd Even Linked List Split',
    'Palindrome Linked List Check', 'LRU Cache Design'
  ],
  'stack-queue': [
    'Stack Array Implementation', 'Stack List Implementation', 'Valid Bracket Checker',
    'Monotonic Stack Decreasing', 'Monotonic Stack Increasing', 'Next Greater Element I',
    'Next Greater Element II', 'Expression Infix to Postfix', 'Evaluate Postfix Expression',
    'Min Stack Design', 'Queue Array Implementation', 'Queue List Implementation',
    'Circular Queue Operations', 'Double Ended Queue (Deque)', 'Sliding Window Maximum',
    'Monotonic Queue Design', 'Stack Using Two Queues', 'Queue Using Two Stacks',
    'Design Circular Deque', 'First Unique Char in Stream', 'Generate Binary Numbers',
    'Simplify Path Directory', 'Asteroid Collision Solver', 'Basic Calculator Implementation'
  ],
  'hashing': [
    'Hash Function Design', 'Direct Address Tables', 'Collision Chaining Method', 'Collision Open Addressing',
    'Linear & Quadratic Probing', 'Double Hashing Resolution', 'Frequency Count Maps',
    'Design HashSet From Scratch', 'Design HashMap From Scratch', 'Subarray Sum Equals K',
    'Longest Consecutive Sequence', 'Two Sum HashMap Version', 'Group Anagrams Together',
    'First Unique Character', 'Intersection of Two Arrays', 'Find All Duplicates',
    'Isomorphic Strings Check', 'Word Pattern Match Check', 'Design Authentication Manager',
    'Ransom Note Character Check', 'Happy Number Solver', 'Verifying Alien Dictionary',
    'Subdomain Visit Count', 'Consistent Hashing Concept'
  ],
  'trees': [
    'Binary Tree Node Structure', 'Inorder Traversal Iterative', 'Preorder Traversal Iterative',
    'Postorder Traversal Iterative', 'Level Order BFS Traversal', 'Maximum Depth of Tree',
    'Invert Binary Tree Solver', 'Symmetric Binary Tree Check', 'Path Sum Checker',
    'Binary Search Tree Lookup', 'BST Insertion Algorithm', 'BST Deletion Algorithm',
    'Validate Binary Search Tree', 'Lowest Common Ancestor BST', 'Lowest Common Ancestor Binary Tree',
    'AVL Tree Left Rotation', 'AVL Tree Right Rotation', 'Heap Insertion & Bubble Up',
    'Heap Extract Min & Heapify', 'Kth Largest Element Heap', 'Binary Tree Right Side View',
    'Construct Tree Pre-Inorder', 'Serialize Deserialize Tree', 'Diameter of Binary Tree'
  ],
  'graphs': [
    'Adjacency Matrix Graph', 'Adjacency List Graph', 'Breadth First Search BFS',
    'Depth First Search DFS', 'Connected Components Count', 'Cycle Detection Undirected',
    'Cycle Detection Directed', 'Topological Sort DFS', 'Topological Sort Kahn\'s',
    'Dijkstra\'s Shortest Path', 'Bellman Ford Shortest Path', 'Floyd Warshall All-Pairs',
    'Prim\'s Minimum Spanning', 'Kruskal\'s Minimum Spanning', 'Disjoint Set Union DSU',
    'DSU Union By Rank/Size', 'DSU Path Compression', 'Kosaraju SCC Finder',
    'Tarjan SCC Finder', 'Find Bridges in Graph', 'Articulation Points Finder',
    'Bipartite Graph Checker', 'Word Ladder BFS Solver', 'Network Delay Time Dijkstra'
  ],
  'recursion-backtracking': [
    'Recursion Call Stack Frame', 'Factorial & Fibonacci Call', 'Generate All Subsets',
    'Generate Subsets with Dupes', 'Generate All Permutations', 'Generate Permutations II',
    'Combination Sum Solver', 'Combination Sum II Solver', 'N-Queens Placement Solver',
    'N-Queens Solutions Count', 'Sudoku Board Solver', 'Sudoku Validator Check',
    'Rat in a Maze Paths', 'Word Search in Grid', 'Palindromic Partitioning',
    'Letter Combinations Phone', 'Generate Parentheses Valid', 'Restore IP Addresses',
    'Beautiful Arrangement', 'Wildcard Pattern Backtrack', 'Expression Add Operators',
    'Hamiltonian Path Finder', 'Knight\'s Tour Solver', 'Solve Crossword Puzzle'
  ],
  'dynamic-programming': [
    'Fibonacci Memoization DP', 'Fibonacci Tabulation DP', 'Climbing Stairs Ways',
    'Min Cost Climbing Stairs', 'House Robber DP Solver', 'House Robber II Circular',
    'Unique Paths Grid DP', 'Unique Paths II Hurdles', 'Minimum Path Sum Grid',
    '0/1 Knapsack Recursive', '0/1 Knapsack Tabulation', 'Unbounded Knapsack Solver',
    'Coin Change Minimum Coins', 'Coin Change II Combinations', 'Longest Increasing Subsequence',
    'Longest Common Subsequence', 'Edit Distance DP Solver', 'Matrix Chain Multiplication',
    'Burst Balloons DP Solver', 'Digit DP Introduction', 'Digit DP Range Sum',
    'Bitmask DP Traveling Sales', 'Bitmask DP Assignment', 'Partition Equal Subset Sum'
  ],
  'greedy-algorithms': [
    'Greedy Choice Property', 'Activity Selection Solver', 'Fractional Knapsack Sort',
    'Huffman Coding Trees', 'Huffman Decoding Logic', 'Job Sequencing Deadlines',
    'Gas Station Circular Loop', 'Candy Distribution Kids', 'Assign Cookies Greedy',
    'Lemonade Change Logic', 'Minimum Platforms Train', 'N Meetings in One Room',
    'Jump Game Reaching End', 'Jump Game II Min Jumps', 'Task Scheduler Cool Down',
    'Non-overlapping Intervals', 'Insert Interval Solver', 'Queue Reconstruction Height',
    'Minimum Number of Arrows', 'Partition Labels String', 'Valid Parenthesis String',
    'Boats to Save People', 'Maximize Sum After K Negations', 'Wiggle Subsequence Max'
  ],
  'advanced-data-structures': [
    'Trie Node Structure Prefix', 'Trie Search & StartsWith', 'Segment Tree Build Range',
    'Segment Tree Query Range', 'Segment Tree Update Point', 'Fenwick Tree Point Update',
    'Fenwick Tree Prefix Query', 'Sparse Table RMQ Build', 'Sparse Table RMQ Query',
    'Ordered Set Introduction', 'Policy Based Tree Custom', 'Segment Tree Lazy Propagation',
    'Segment Tree Lazy Updates', 'Suffix Trie String Matching', 'Suffix Automaton Basics',
    'Treap Randomized Search', 'Splay Tree Rotations', 'Red-Black Tree Insertion',
    'Link Cut Tree Concept', 'Disjoint Set Rollback DSU', 'Fenwick Tree 2D Operations',
    'Trie Delete Key Method', 'Trie Autosuggestion List', 'Range Update Point Query'
  ],
  'advanced-algorithms': [
    'Ford-Fulkerson Max Flow', 'Edmonds-Karp Max Flow', 'Dinic\'s Algorithm Blocks',
    'Min Cut Max Flow Theorem', 'KMP Automaton Matcher', 'Rabin Karp Rolling Hash 2D',
    'Aho-Corasick Multi-Pattern', 'Suffix Array Build Sort', 'Suffix Array LCP Table',
    'Suffix Tree Ukkonen Build', 'Convex Hull Graham Scan', 'Convex Hull Jarvis March',
    'Line Segment Intersection', 'Point In Polygon Ray Cast', 'Polygon Area Shoelace',
    'Closest Pair of Points', 'Stable Marriage Gale-Shapley', 'Bipartite Matching Hopcroft',
    'Chinese Postman Problem', 'Traveling Salesman Exact', 'Fast Fourier Transform FFT',
    'Tarjan Offline LCA Query', 'Heavy-Light Decomposition', 'Centroid Decomposition'
  ]
};

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'Uber', 'Airbnb', 'Adobe', 'Oracle', 'Twitter', 'Goldman Sachs', 'Bloomberg'];
const TOPIC_TAGS: { [key: string]: string[] } = {
  'programming-fundamentals': ['Basic syntax', 'Conditionals', 'Loops', 'Bitwise', 'Recursion'],
  'arrays': ['Arrays', 'Binary Search', 'Sorting', 'Two Pointers', 'Sliding Window', 'Prefix Sum'],
  'strings': ['Strings', 'Hashing', 'KMP', 'Trie', 'Sliding Window'],
  'linked-lists': ['Linked List', 'Two Pointers', 'Recursion', 'LRU'],
  'stack-queue': ['Stack', 'Queue', 'Monotonic Stack', 'Deque'],
  'hashing': ['Hash Table', 'Frequency', 'Prefix Sum'],
  'trees': ['Tree', 'Binary Search Tree', 'Binary Tree', 'Heap', 'DFS', 'BFS'],
  'graphs': ['Graph', 'BFS', 'DFS', 'Shortest Path', 'Union Find', 'Topological Sort'],
  'recursion-backtracking': ['Backtracking', 'Recursion', 'Subsets'],
  'dynamic-programming': ['Dynamic Programming', 'Memoization', 'Tabulation', 'Knapsack', 'LCS', 'LIS'],
  'greedy-algorithms': ['Greedy', 'Sorting', 'Intervals'],
  'advanced-data-structures': ['Segment Tree', 'Fenwick Tree', 'Trie', 'Range Query'],
  'advanced-algorithms': ['Math', 'Geometry', 'Network Flow', 'Suffix Array', 'String Matching']
};

// Seeding logic
async function main() {
  console.log('Clearing database...');
  await prisma.xPTransaction.deleteMany({});
  await prisma.userBadge.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.revisionItem.deleteMany({});
  await prisma.userQuestionProgress.deleteMany({});
  await prisma.userProgress.deleteMany({});
  await prisma.chatHistory.deleteMany({});
  await prisma.interviewQuestion.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.concept.deleteMany({});
  await prisma.phase.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding Phases...');
  const phasesMap: { [slug: string]: string } = {};
  for (const phase of PHASES) {
    const createdPhase = await prisma.phase.create({
      data: {
        title: phase.title,
        slug: phase.slug,
        description: phase.description,
        order: phase.order
      }
    });
    phasesMap[phase.slug] = createdPhase.id;
  }

  console.log('Seeding Badges...');
  const badges = [
    { name: 'DSA Novice', description: 'Begin your DSA journey and earn your first 10 XP!', icon: 'lucide-award', xpRequired: 10 },
    { name: 'Consistent Coder', description: 'Unlock this by achieving a 3-day daily streak!', icon: 'lucide-flame', xpRequired: 50 },
    { name: 'Algorithm Explorer', description: 'Acquire a total of 100 XP from solving problems.', icon: 'lucide-compass', xpRequired: 100 },
    { name: 'Data Structure Wizard', description: 'Demonstrate Mastery in core DS concepts by earning 500 XP.', icon: 'lucide-wand-2', xpRequired: 500 },
    { name: 'Coding Grandmaster', description: 'Reach the pinnacle of competitive DSA with 1000 XP!', icon: 'lucide-crown', xpRequired: 1000 },
    { name: 'AI Apprentice', description: 'Engage the AI Tutor for assistance across 5 problems.', icon: 'lucide-bot', xpRequired: 200 }
  ];
  for (const badge of badges) {
    await prisma.badge.create({ data: badge });
  }

  console.log('Seeding Concepts and Questions (Programmatic Seeding for 312 Concepts)...');

  let conceptCount = 0;
  let questionCount = 0;
  let interviewQuestionCount = 0;

  for (const phaseSlug of PHASES.map(p => p.slug)) {
    const phaseId = phasesMap[phaseSlug];
    const topics = TOPICS_PER_PHASE[phaseSlug] || [];
    const tags = TOPIC_TAGS[phaseSlug] || ['DSA'];

    for (let i = 0; i < topics.length; i++) {
      const topicName = topics[i];
      const conceptSlug = `${phaseSlug}-${topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      // Create Concept
      const concept = await prisma.concept.create({
        data: {
          phaseId,
          title: topicName,
          slug: conceptSlug,
          order: i + 1,
          description: `Learn the fundamentals, operations, and optimized strategies for ${topicName}.`,
          notes: `# Mastering ${topicName}
Here is a comprehensive guide to understanding **${topicName}**.

## Overview
${topicName} is a fundamental concept in computing. Understanding how it operates and is represented in memory is crucial for optimization and competitive programming.

## Core Properties
1. **Efficiency**: How it structures operations under various memory bounds.
2. **Access Patterns**: Reading and writing characteristics.
3. **Optimized Methods**: Common algorithmic patterns linked to this concept.

## Visual Flow Representation
\`\`\`
[Input Data] ──► [Process: ${topicName}] ──► [Optimized Output]
                     ▲
                     │ (Complexity Tuning)
               [Edge Cases]
\`\`\`
`,
          complexityAnalysis: `### Complexity Analysis of ${topicName}

| Operation | Time Complexity (Average) | Time Complexity (Worst) | Space Complexity |
|-----------|---------------------------|-------------------------|------------------|
| Initializing | O(1) or O(N)             | O(N)                    | O(N)             |
| Access / Query | O(1)                     | O(N) or O(log N)        | O(1)             |
| Update | O(1)                     | O(N)                    | O(1)             |
`,
          realWorldApps: `- **Database Caching**: Fast indexing and retrieval.
- **Compiler Optimizations**: Scope checking and parsing.
- **Operating Systems**: Thread scheduling and resource mapping.`,
          commonMistakes: `- **Off-by-One Errors**: Reading indices outside valid boundary ranges.
- **Memory Leaks**: Forgetting to clean up pointers in dynamic configurations.
- **Unbounded Recursion**: Omitting crucial base cases resulting in stack overflow errors.`,
          interviewTips: `1. **Ask clarifying questions**: Ask if inputs can be negative, empty, or contain duplicates.
2. **Start with Brute Force**: State the naive O(N^2) or O(2^N) solution first, then show how to optimize it using a HashMap, Two Pointers, or DP.
3. **Write Dry Runs**: Walk through your solution using a small test case before coding.`
        }
      });
      conceptCount++;

      // Seed 5 Questions for each Concept (Total Questions: 312 * 5 = 1560)
      for (let q = 1; q <= 5; q++) {
        const difficulty = q === 1 || q === 2 ? 'EASY' : (q === 3 || q === 4 ? 'MEDIUM' : 'HARD');
        const qTitle = `${topicName} Challenge ${q === 1 ? 'Basics' : q === 2 ? 'Optimization' : q === 3 ? 'Intermediate' : q === 4 ? 'Deep Dive' : 'Expert'}`;
        const qSlug = `${conceptSlug}-q${q}`;

        // Generate dynamic company tags
        const qCompanies = [
          COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
          COMPANIES[Math.floor(Math.random() * COMPANIES.length)]
        ].filter((v, idx, self) => self.indexOf(v) === idx);

        // Generate template codes
        const codeTemplates = {
          cpp: `// C++ Template
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int solve(vector<int>& nums, int target) {
        // Write your code here
        return 0;
    }
};`,
          java: `// Java Template
import java.util.*;

class Solution {
    public int solve(int[] nums, int target) {
        // Write your code here
        return 0;
    }
}`,
          python: `# Python Template
class Solution:
    def solve(self, nums: list[int], target: int) -> int:
        # Write your code here
        return 0`,
          javascript: `// JavaScript Template
class Solution {
    solve(nums, target) {
        // Write your code here
        return 0;
    }
}`
        };

        const bruteForceSolution = `class Solution {
    solve(nums, target) {
        for(let i = 0; i < nums.length; i++) {
            if(nums[i] === target) return i;
        }
        return -1;
    }
}`;
        const optimalSolution = `class Solution {
    solve(nums, target) {
        let low = 0, high = nums.length - 1;
        while(low <= high) {
            let mid = Math.floor((low + high) / 2);
            if(nums[mid] === target) return mid;
            else if(nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`;

        await prisma.question.create({
          data: {
            conceptId: concept.id,
            title: qTitle,
            slug: qSlug,
            difficulty,
            acceptanceRate: parseFloat((40 + Math.random() * 45).toFixed(1)),
            estimatedTime: q === 1 || q === 2 ? 15 : (q === 3 || q === 5 ? 30 : 45),
            companyTags: JSON.stringify(qCompanies),
            tags: JSON.stringify(tags),
            problemStatement: `Given a set of inputs representing elements of type **${topicName}**, implement an algorithm that completes challenge **${qTitle}** efficiently.

### Example 1
**Input:** \`nums = [1, 3, 5, 7], target = 5\`  
**Output:** \`2\`  
**Explanation:** The target is located at index 2.

### Constraints
- \`1 <= nums.length <= 10^5\`
- \`-10^9 <= nums[i] <= 10^9\`
`,
            hints: JSON.stringify([
              `Try to identify if the data has sorted or hashable properties.`,
              `A brute force check takes O(N) time. Can you do it in O(log N) or O(1)?`,
              `Consider two pointer or hash mapping techniques for optimal speed.`
            ]),
            bruteForceSolution,
            betterSolution: bruteForceSolution,
            optimalSolution,
            bruteForceExplanation: `Iterate through the collections using a nested loop structure. Compare every pair or item to the goal criteria. This naive method ensures completeness but is highly inefficient.`,
            betterExplanation: `Optimize storage using a temporary hash table to cache previously visited nodes. Reduces runtime search space significantly.`,
            optimalExplanation: `Use spatial reduction (binary division or dynamic state vectors) to complete operations in logarithmic or linear bounds, requiring minimal extra storage variables.`,
            codeTemplates: JSON.stringify(codeTemplates),
            complexityAnalysis: JSON.stringify({
              bruteForce: { time: 'O(N^2)', space: 'O(1)' },
              better: { time: 'O(N)', space: 'O(N)' },
              optimal: { time: 'O(log N)', space: 'O(1)' }
            })
          }
        });
        questionCount++;
      }

      // Seed 2 Interview Questions for each Concept (Total Interview Questions: 312 * 2 = 624)
      for (let iq = 1; iq <= 2; iq++) {
        const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
        await prisma.interviewQuestion.create({
          data: {
            conceptId: concept.id,
            title: `${company} Interview: Explain ${topicName}`,
            company,
            frequency: Math.floor(Math.random() * 5) + 1,
            questionText: `How does the ${topicName} concept apply in high-frequency trading systems or large-scale distributed databases? Explain key optimizations.`,
            answerText: `To apply ${topicName} in high-capacity systems:
1. **Reduce Lock Contention**: Avoid globally locked lists; use split locks or lock-free compare-and-swap operations.
2. **Optimize Memory Locality**: Choose arrays over individual node lists to benefit from CPU cache pre-fetching.
3. **Implement Amortization**: Rebuild underlying hash configurations in background threads to avoid latency spikes.`
          }
        });
        interviewQuestionCount++;
      }
    }
  }

  // Create a default seed user for easy testing
  const bcrypt = require('bcryptjs');
  const dummyPasswordHash = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'demo@masteryhub.com',
      name: 'Jane Doe',
      passwordHash: dummyPasswordHash,
      xp: 250,
      streak: 5,
      lastActive: new Date(),
    }
  });

  console.log(`\nDatabase Seeding Completed Successfully!`);
  console.log(`-----------------------------------------`);
  console.log(`Phases Created: ${PHASES.length}`);
  console.log(`Concepts Created: ${conceptCount}`);
  console.log(`Questions Created: ${questionCount}`);
  console.log(`Interview Questions Created: ${interviewQuestionCount}`);
  console.log(`Dummy User Created: demo@masteryhub.com / password123`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
