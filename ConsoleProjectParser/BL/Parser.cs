using AngleSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Parser
    {
        public string Address { get;}

        public string Selector { get;}

        public Parser (string address, string selector)
        {
            if(String.IsNullOrEmpty(address))
            { 
               throw new ArgumentNullException(nameof(address));
            }
            if(String.IsNullOrEmpty(selector))
            {
                throw new ArgumentNullException(nameof(selector));
            }
            Address = address;
            Selector = selector;
            
        }

        public async Task<IEnumerable<string>> ParserHtml()
        {
            try
            {
                var config = Configuration.Default.WithDefaultLoader();
                var context = BrowsingContext.New(config);
                var document = await context.OpenAsync(Address);
                var cells = document.QuerySelectorAll(Selector);
                return cells.Select(m => m.TextContent).ToList();
            }
            catch (Exception ex) 
            {
                //
                return null;
            }
        }
    }
}
