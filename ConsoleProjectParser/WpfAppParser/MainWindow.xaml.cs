using BL;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;

namespace WpfAppParser
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }
        private async void Button_click(object sender, RoutedEventArgs e)
        {
            if (!Regex.IsMatch(textUrl.Text, @"^?https*:\/\/", RegexOptions.IgnoreCase))
            {
                textUrl.Text = "http://" + textUrl.Text;
            }
            if (!Regex.IsMatch(textPath.Text, @"^?xlsx", RegexOptions.IgnoreCase))
            {
                textPath.Text += ".xlsx";
            }

            var parser = new Parser(textUrl.Text, textSelector.Text);

            var info = await parser.ParserHtml();
           
            Excel.Write(info, textPath.Text, textUrl.Text);

            MessageBox.Show("Data written successfully");
        }

        private void textUrl_TextChanged(object sender, TextChangedEventArgs e)
        {

        }
    }
}
