<?php
header('Content-Type: application/json');

$newsFile = 'news.json';
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['title']) && isset($input['content'])) {
    $currentNews = json_decode(file_get_contents($newsFile), true);
    
    $newItem = [
        'date' => date('Y-m-d'),
        'title' => $input['title'],
        'content' => $input['content']
    ];
    
    array_unshift($currentNews['news'], $newItem);
    
    file_put_contents($newsFile, json_encode($currentNews, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}
?>